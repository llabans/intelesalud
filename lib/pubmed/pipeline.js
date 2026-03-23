/**
 * PubMed → DeepSeek → PostgreSQL pipeline.
 * Fetches lifestyle/prevention articles from NCBI, summarizes in Spanish
 * with DeepSeek, and stores in the HealthArticle table.
 *
 * Designed to run once daily via cron trigger.
 */

const NCBI_API_KEY = process.env.NCBI_API_KEY || '';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const EUTILS_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

const SEARCH_QUERIES = [
  '"healthy lifestyle"[Mesh] AND "health promotion"[Mesh]',
  '"exercise"[Mesh] AND "disease prevention"[Mesh]',
  '"diet, healthy"[Mesh] AND "chronic disease/prevention"[Mesh]',
  '"mental health"[Mesh] AND "stress, psychological/prevention"[Mesh]',
  '"sleep hygiene"[Mesh] OR ("sleep"[Mesh] AND "quality of life"[Mesh])',
  '"walking"[Mesh] AND "cardiovascular diseases/prevention"[Mesh]',
  '"mindfulness"[Mesh] AND "anxiety"[Mesh]',
  '"Mediterranean diet"[Mesh]',
  '"diabetes mellitus, type 2/prevention"[Mesh]',
  '"obesity/prevention"[Mesh] AND "lifestyle"[Mesh]',
];

function categorize(title, abstract) {
  const t = (title + ' ' + abstract).toLowerCase();
  if (t.includes('cardio') || t.includes('heart') || t.includes('hypertens') || t.includes('vascular')) return 'Cardiología';
  if (t.includes('mental') || t.includes('anxiety') || t.includes('depress') || t.includes('mindful') || t.includes('stress')) return 'Salud Mental';
  if (t.includes('diet') || t.includes('nutri') || t.includes('mediter') || t.includes('food') || t.includes('obes')) return 'Nutrición';
  if (t.includes('diabet') || t.includes('glycem') || t.includes('insulin') || t.includes('metabol')) return 'Endocrinología';
  if (t.includes('sleep') || t.includes('insomn')) return 'Sueño';
  if (t.includes('exercis') || t.includes('physical activity') || t.includes('walk') || t.includes('fitness')) return 'Actividad Física';
  if (t.includes('child') || t.includes('pediatr')) return 'Pediatría';
  return 'Prevención';
}

/**
 * Calls DeepSeek to translate title and summarize abstract in Spanish.
 */
async function summarizeWithDeepSeek(title, abstract) {
  if (!DEEPSEEK_API_KEY) {
    return {
      titleEs: title,
      summary: abstract ? abstract.slice(0, 250) + '…' : 'Artículo disponible en PubMed.',
    };
  }

  const prompt = `Eres un divulgador médico. Dado este artículo científico, genera:

1. **titulo**: Traduce el título al español de forma clara y atractiva para un paciente sin conocimientos médicos. Máximo 15 palabras. No uses jerga médica compleja.

2. **resumen**: Resume el abstract en 2 oraciones en español simple. Enfócate en qué descubrieron y cómo puede aplicarlo una persona común en su vida diaria. Máximo 200 caracteres.

TÍTULO ORIGINAL: ${title}

ABSTRACT: ${abstract || 'No disponible'}

Responde SOLO en JSON con esta estructura exacta (sin markdown, sin backticks):
{"titulo": "...", "resumen": "..."}`;

  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        titleEs: parsed.titulo || title,
        summary: parsed.resumen || abstract?.slice(0, 250) || '',
      };
    }

    return { titleEs: title, summary: abstract?.slice(0, 250) || '' };
  } catch (err) {
    console.error('[DeepSeek] Error:', err.message);
    return { titleEs: title, summary: abstract?.slice(0, 250) || '' };
  }
}

/**
 * Main pipeline: fetch from PubMed, summarize with DeepSeek, return articles.
 * @param {number} count - Number of articles to fetch (default 20)
 */
export async function fetchAndSummarizeArticles(count = 20) {
  // Use multiple search queries to get diverse results
  const idsPerQuery = Math.ceil(count / SEARCH_QUERIES.length);
  const allIds = new Set();

  for (const query of SEARCH_QUERIES) {
    if (allIds.size >= count * 2) break; // Fetch extra for dedup
    try {
      const searchUrl = `${EUTILS_BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${idsPerQuery + 2}&sort=date&retmode=json&datetype=pdat&reldate=90&api_key=${NCBI_API_KEY}`;
      const res = await fetch(searchUrl);
      const data = await res.json();
      const ids = data?.esearchresult?.idlist || [];
      ids.forEach(id => allIds.add(id));
    } catch (err) {
      console.error(`[PubMed] Search failed for query: ${query}`, err.message);
    }
  }

  const uniqueIds = [...allIds].slice(0, count + 5);
  if (uniqueIds.length === 0) {
    console.error('[PubMed] No article IDs found');
    return [];
  }

  // Fetch summaries
  const summaryUrl = `${EUTILS_BASE}/esummary.fcgi?db=pubmed&id=${uniqueIds.join(',')}&retmode=json&api_key=${NCBI_API_KEY}`;
  const summaryRes = await fetch(summaryUrl);
  const summaryData = await summaryRes.json();

  // Fetch abstracts
  const abstractUrl = `${EUTILS_BASE}/efetch.fcgi?db=pubmed&id=${uniqueIds.join(',')}&rettype=abstract&retmode=xml&api_key=${NCBI_API_KEY}`;
  const abstractRes = await fetch(abstractUrl);
  const abstractXml = await abstractRes.text();

  // Parse abstracts
  const abstractMap = {};
  const matches = abstractXml.matchAll(/<PMID[^>]*>(\d+)<\/PMID>[\s\S]*?<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g);
  for (const m of matches) {
    if (!abstractMap[m[1]]) {
      abstractMap[m[1]] = m[2].replace(/<[^>]+>/g, '').trim();
    }
  }

  // Process each article with DeepSeek
  const articles = [];
  for (const id of uniqueIds) {
    if (articles.length >= count) break;

    const item = summaryData?.result?.[id];
    if (!item || !item.title) continue;

    const title = item.title.replace(/\.$/, '');
    const abstract = abstractMap[id] || '';
    const journal = item.fulljournalname || item.source || 'PubMed';
    const pubDate = item.pubdate || '';

    // Skip articles without abstract (they're less useful)
    if (!abstract || abstract.length < 100) continue;

    const { titleEs, summary } = await summarizeWithDeepSeek(title, abstract);

    articles.push({
      pubmedId: id,
      title,
      titleEs,
      summary,
      category: categorize(title, abstract),
      journal,
      pubDate,
      url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
    });

    // Rate limit: small delay between DeepSeek calls
    if (DEEPSEEK_API_KEY) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  return articles;
}
