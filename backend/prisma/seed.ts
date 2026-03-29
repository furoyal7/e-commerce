import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      firstName: 'Regular',
      lastName: 'User',
      role: 'USER',
    },
  });

  // Create categories
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
    },
  });

  const tools = await prisma.category.create({
    data: {
      name: 'Tools',
      slug: 'tools',
      description: 'Professional tools and equipment',
    },
  });

  const subcategory = await prisma.category.create({
    data: {
      name: 'Power Tools',
      slug: 'power-tools',
      description: 'Electric and battery-powered tools',
      parentId: tools.id,
    },
  });

  // Create products
  const productData = [
    {
      name: 'Professional Drill Machine',
      slug: 'professional-drill-machine',
      description: 'High-quality drill machine for professional use with variable speed control.',
      price: 299.99,
      currency: 'USD',
      stock: 50,
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
      status: 'published' as any,
      categories: { connect: [{ id: subcategory.id }] },
    },
    {
      name: 'Wireless Headphones',
      slug: 'wireless-headphones',
      description: 'Premium noise-canceling wireless headphones with 30-hour battery life.',
      price: 199.99,
      currency: 'USD',
      stock: 100,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      status: 'published' as any,
      categories: { connect: [{ id: electronics.id }] },
    },
    {
      name: 'Laptop Stand',
      slug: 'laptop-stand',
      description: 'Adjustable aluminum laptop stand for better ergonomics.',
      price: 49.99,
      currency: 'USD',
      stock: 75,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
      status: 'published' as any,
      categories: { connect: [{ id: electronics.id }] },
    },
    {
      name: 'Socket Set',
      slug: 'socket-set',
      description: 'Complete socket set with ratchet and extensions.',
      price: 89.99,
      currency: 'USD',
      stock: 30,
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
      status: 'draft' as any,
      categories: { connect: [{ id: tools.id }] },
    },
  ];

  for (const product of productData) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
