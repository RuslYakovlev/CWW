import { PrismaClient } from '@prisma/client';
import { syncYoutubeSermons } from './services/youtubeSync';

const prisma = new PrismaClient();

async function main() {
  const result = await syncYoutubeSermons(prisma);
  console.log(`YouTube sync complete: ${result.created} created, ${result.updated} updated, ${result.total} found.`);
}

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
