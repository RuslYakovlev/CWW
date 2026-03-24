import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.user.findFirst();
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: { username: 'admin', password: hashedPassword },
    });
    console.log('Admin created');
  }

  const sermonCount = await prisma.sermon.count();
  if (sermonCount === 0) {
    await prisma.sermon.createMany({
      data: [
        { title: "Жизнь по духу", speaker: "Пастор Евгений Адвахов", imageUrl: "https://placehold.co/800x600/FF5722/FFFFFF?text=ЖИЗНЬ+ПО+ДУХУ%0AПАСТОР+ЕВГЕНИЙ+АДВАХОВ" },
        { title: "Где вера ваша? или В какого Бога ты веришь?", speaker: "Пастор Александр Белев", imageUrl: "https://placehold.co/800x600/FF9800/FFFFFF?text=ГДЕ+ВЕРА+ВАША?%0AПастор+Александр+Белев" },
        { title: "За пределами шаблонов", speaker: "Радион Вельчев", imageUrl: "https://placehold.co/800x600/E0E0E0/000000?text=ЗА+ПРЕДЕЛАМИ+ШАБЛОНОВ%0AРАДИОН+ВЕЛЬЧЕВ" },
      ]
    });
    console.log('Sermons seeded');
  }
  
  const eventCount = await prisma.event.count();
  if (eventCount === 0) {
    await prisma.event.create({
      data: {
        title: "Ближайшее событие",
        subtitle: "Воскресное Богослужение",
        dateLabel: "Каждое воскресенье",
        timeLabel: "10:00 и 12:00",
        formatLabel: "Офлайн и Онлайн",
        imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200"
      }
    });
    console.log('Events seeded');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
