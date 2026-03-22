const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const { ensurePlatformCatalog } = await import('../lib/platform/bootstrap.js');
  await ensurePlatformCatalog(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('[Seed] Failed to seed InteleSalud catalog:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
