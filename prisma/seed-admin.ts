import { PrismaClient, Role } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function seedAdmin() {
  console.log('🌱 Starting SUPER_ADMIN seed...');

  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'superadmin@lingual.com';
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123456';
  const superAdminName = process.env.SUPER_ADMIN_NAME || 'Lingual Super Admin';

  const passwordHash = await argon2.hash(superAdminPassword);

  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {
      role: Role.SUPER_ADMIN,
    },
    create: {
      email: superAdminEmail,
      passwordHash,
      displayName: superAdminName,
      role: Role.SUPER_ADMIN,
      interfaceLocale: 'vi',
      timezone: 'Asia/Ho_Chi_Minh',
      dailyGoalMinutes: 30,
      totalXP: 1000,
      currentStreak: 10,
    },
  });

  console.log(`✅ SUPER_ADMIN seeded successfully!`);
  console.log(`   ID: ${superAdmin.id}`);
  console.log(`   Email: ${superAdmin.email}`);
  console.log(`   Role: ${superAdmin.role}`);
}

seedAdmin()
  .catch((e) => {
    console.error('❌ Error seeding SUPER_ADMIN:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
