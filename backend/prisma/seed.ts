import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Adatbázis feltöltése kezdő adatokkal...');

  await prisma.booking.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: 'teszt@elek.hu',
      name: 'Teszt Elek',
      password: 'password123',
    },
  });

  const resource1 = await prisma.resource.create({
    data: {
      name: 'Tárgyaló A (10 fő)',
      description: 'A/C-val, projektorral és whiteboarddal felszerelt nagy tárgyalóterem.',
    },
  });

  const resource2 = await prisma.resource.create({
    data: {
      name: 'Sony FX3 Kamera Kit',
      description: 'Profi 4K videókamera 24-70mm f/2.8 objektívvel és 2x128GB SD kártyával.',
    },
  });

  const resource3 = await prisma.resource.create({
    data: {
      name: 'PlayStation 5 Konzol',
      description: 'Közösségi szoba PS5 konzol 2 kontrólerrel és FIFA/FC 26-tal.',
    },
  });

  console.log('✅ Sikeres feltöltés:', { resource1, resource2, resource3 });
}

main()
  .catch((e) => {
    console.error('❌ Hiba a feltöltés során:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });