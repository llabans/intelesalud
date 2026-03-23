import { prisma } from '@/lib/db';

/**
 * GET /api/articles — returns latest active health articles from DB.
 * Query params: ?limit=3 (default 3, max 20)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '3', 10), 20);

    const articles = await prisma.healthArticle.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        pubmedId: true,
        titleEs: true,
        summary: true,
        category: true,
        journal: true,
        pubDate: true,
        url: true,
        createdAt: true,
      },
    });

    // Map to frontend format
    const mapped = articles.map(a => ({
      id: a.id,
      pubmedId: a.pubmedId,
      title: a.titleEs,
      summary: a.summary,
      source: a.journal,
      date: a.pubDate,
      category: a.category,
      url: a.url,
    }));

    return Response.json({ articles: mapped, source: 'database' });
  } catch (error) {
    console.error('[Articles API] Error:', error.message);
    return Response.json({ articles: [], error: error.message }, { status: 500 });
  }
}
