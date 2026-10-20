import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating admin user...');

  const password = 'Admin@12345';
  const hash = await bcrypt.hash(password, 12);

  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@deshimoslar.com' },
    update: {
      password: hash,
      role: 'ADMIN',
      isActive: true,
      isBlocked: false,
    },
    create: {
      name: 'Admin User',
      email: 'admin@deshimoslar.com',
      phone: '01700000099',
      password: hash,
      role: 'ADMIN',
      isActive: true,
      cart: { create: {} },
    },
  });

  console.log('Admin created/updated:');
  console.log('  Email:    admin@deshimoslar.com');
  console.log('  Password: Admin@12345');
  console.log('  Role:     ADMIN');
  console.log('  ID:       ' + admin.id);

  // Also create super admin
  const superHash = await bcrypt.hash('SuperAdmin@2025', 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@deshimoslar.com' },
    update: {
      password: superHash,
      role: 'SUPER_ADMIN',
      isActive: true,
      isBlocked: false,
    },
    create: {
      name: 'Super Admin',
      email: 'superadmin@deshimoslar.com',
      phone: '01700000098',
      password: superHash,
      role: 'SUPER_ADMIN',
      isActive: true,
      cart: { create: {} },
    },
  });

  console.log('\nSuper Admin created/updated:');
  console.log('  Email:    superadmin@deshimoslar.com');
  console.log('  Password: SuperAdmin@2025');
  console.log('  Role:     SUPER_ADMIN');
  console.log('  ID:       ' + superAdmin.id);

  await prisma.$disconnect();
  console.log('\nDone!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
