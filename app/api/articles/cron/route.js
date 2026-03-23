import { prisma } from '@/lib/db';
import { fetchAndSummarizeArticles } from '@/lib/pubmed/pipeline';

const CRON_SECRET = process.env.CRON_SECRET || 'intelesalud-cron-2026';

/**
 * POST /api/articles/cron — daily trigger to fetch PubMed articles.
 *
 * Protected by CRON_SECRET header. Call from:
 *   - System cron: curl -X POST https://intelesalud.medicalcore.app/api/articles/cron -H "x-cron-secret: YOUR_SECRET"
 *   - Or manually from admin panel
 *
 * Fetches 20 lifestyle/prevention articles, summarizes with DeepSeek,
 * stores in PostgreSQL. Deactivates articles older than 30 days.
 */
export async function POST(request) {
  // Auth check
  const secret = request.headers.get('x-cron-secret');
  if (secret !== CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[Cron] Starting PubMed article fetch...');

    // Fetch and summarize
    const articles = await fetchAndSummarizeArticles(20);
    console.log(`[Cron] Got ${articles.length} articles from PubMed + DeepSeek`);

    if (articles.length === 0) {
      return Response.json({ message: 'No articles fetched', inserted: 0 });
    }

    // Upsert into database (skip duplicates by pubmedId)
    let inserted = 0;
    let skipped = 0;

    for (const article of articles) {
      try {
        await prisma.healthArticle.upsert({
          where: { pubmedId: article.pubmedId },
          update: {
            titleEs: article.titleEs,
            summary: article.summary,
            category: article.category,
            active: true,
          },
          create: {
            pubmedId: article.pubmedId,
            title: article.title,
            titleEs: article.titleEs,
            summary: article.summary,
            category: article.category,
            journal: article.journal,
            pubDate: article.pubDate,
            url: article.url,
            active: true,
          },
        });
        inserted++;
      } catch (err) {
        skipped++;
        console.error(`[Cron] Failed to upsert ${article.pubmedId}:`, err.message);
      }
    }

    // Deactivate articles older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deactivated = await prisma.healthArticle.updateMany({
      where: {
        createdAt: { lt: thirtyDaysAgo },
        active: true,
      },
      data: { active: false },
    });

    console.log(`[Cron] Done: ${inserted} inserted, ${skipped} skipped, ${deactivated.count} deactivated`);

    return Response.json({
      message: 'Cron completed',
      inserted,
      skipped,
      deactivated: deactivated.count,
      total: articles.length,
    });
  } catch (error) {
    console.error('[Cron] Pipeline error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
