import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.sermon.deleteMany({});
  await prisma.sermon.createMany({
    data: [
      { title: "Жизнь по духу", speaker: "Пастор Евгений Адвахов", imageUrl: "https://placehold.co/800x600/FF5722/FFFFFF?text=ЖИЗНЬ+ПО+ДУХУ%0AПАСТОР+ЕВГЕНИЙ+АДВАХОВ" },
      { title: "Где вера ваша? или В какого Бога ты веришь?", speaker: "Пастор Александр Белев", imageUrl: "https://placehold.co/800x600/FF9800/FFFFFF?text=ГДЕ+ВЕРА+ВАША?%0AПастор+Александр+Белев" },
      { title: "За пределами шаблонов", speaker: "Радион Вельчев", imageUrl: "https://placehold.co/800x600/E0E0E0/000000?text=ЗА+ПРЕДЕЛАМИ+ШАБЛОНОВ%0AРАДИОН+ВЕЛЬЧЕВ" },
    ]
  });
  console.log('Sermons updated');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
