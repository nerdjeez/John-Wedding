import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai Seeding Database...");

  // Bersihkan data lama
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.package.deleteMany();
  await prisma.user.deleteMany();

  // 1. Buat User CUSTOMER Biasa
  const passCustomer = await Bun.password.hash("123");
  await prisma.user.create({
    data: {
      name: "Bimo Customer",
      email: "user@test.com",
      password: passCustomer, 
      role: "customer"
    }
  });

  // 2. Buat User ADMIN (PENTING DISINI)
  const passAdmin = await Bun.password.hash("admin123");
  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin@test.com",
      password: passAdmin, 
      role: "admin" // <--- Role-nya Admin
    }
  });

  // 3. Buat Paket (Sama seperti sebelumnya)
  const packages = [
    {
      name: "Intimate Gold",
      slug: "intimate-gold",
      price: 50000000,
      image: "/images/Paket-Intimate-Gold.jpg", 
      description: "Cocok untuk acara sakral dengan keluarga inti.",
      features: "Dekorasi Minimalis,Catering 50 Pax"
    },
    {
      name: "Luxury Platinum",
      slug: "luxury-platinum",
      price: 64000000,
      image: "/images/Paket-Luxury-Platinum.jpeg",
      description: "Kemewahan pesta kebun dengan nuansa elegan.",
      features: "Dekorasi Full Bunga,Catering 200 Pax"
    },
    {
      name: "Royal Diamond",
      slug: "royal-diamond",
      price: 90000000,
      image: "/images/Paket-Royal-Diamond.jpeg",
      description: "Paket lengkap sultan untuk momen sekali seumur hidup.",
      features: "Ballroom Decor Premium,Catering 500 Pax"
    }
  ];

  for (const pkg of packages) {
    await prisma.package.create({ data: pkg });
  }

  console.log("🚀 Seeding Selesai! Login Admin: admin@test.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });