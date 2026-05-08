import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { DEFAULT_YOUTUBE_CHANNEL_ID, DEFAULT_YOUTUBE_CHANNEL_URL, syncYoutubeSermons } from './services/youtubeSync';

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.user.findFirst();
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({ data: { username: 'admin', password: hashedPassword } });
    console.log('Admin created: admin / admin123');
  }

  await prisma.settings.upsert({
    where: { id: 'global' },
    update: {
      youtubeChannelUrl: DEFAULT_YOUTUBE_CHANNEL_URL,
      youtubeChannelId: DEFAULT_YOUTUBE_CHANNEL_ID,
    },
    create: {
      id: 'global',
      youtubeChannelUrl: DEFAULT_YOUTUBE_CHANNEL_URL,
      youtubeChannelId: DEFAULT_YOUTUBE_CHANNEL_ID,
    },
  });

  const eventCount = await prisma.event.count();
  if (eventCount === 0) {
    await prisma.event.create({
      data: {
        title: 'Ближайшее событие',
        subtitle: 'Воскресное богослужение',
        dateLabel: 'Каждое воскресенье',
        timeLabel: '10:00 и 12:00',
        formatLabel: 'Офлайн и онлайн',
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200',
      },
    });
    console.log('Event seeded');
  }

  const result = await syncYoutubeSermons(prisma);
  console.log(`YouTube sync complete: ${result.created} created, ${result.updated} updated.`);
}

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
