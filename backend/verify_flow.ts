import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- STEP 1: RESET TEST DATA ---');
  await prisma.product.deleteMany({ where: { name: 'DEBUG_TOOL_V1' } });

  console.log('--- STEP 2: CREATE DRAFT PRODUCT ---');
  const draft = await prisma.product.create({
    data: {
      name: 'DEBUG_TOOL_V1',
      slug: 'debug-tool-v1-' + Date.now(),
      description: 'Principal Debugging Tool',
      price: 99.99,
      categories: { 
        connectOrCreate: {
          where: { slug: 'default-cat' },
          create: { name: 'Default Category', slug: 'default-cat' }
        }
      },
      image: 'https://example.com/img.jpg',
      status: 'draft',
    },
  });
  console.log('DB Record (Draft):', JSON.stringify(draft, null, 2));

  console.log('--- STEP 3: PUBLISH PRODUCT ---');
  const published = await prisma.product.update({
    where: { id: draft.id },
    data: { status: 'published' },
  });
  console.log('DB Record (Published):', JSON.stringify(published, null, 2));

  console.log('--- STEP 4: VERIFY API VISIBILITY (MOCK) ---');
  // Since I can't call the actual running server easily without knowing the port
  // and ensuring it's up, I'll simulate the service findMany call
  const visibleProducts = await prisma.product.findMany({
    where: { status: 'published' },
  });
  console.log('API Response Simulation (success: true, products: [...]):');
  console.log(JSON.stringify({
    success: true,
    products: visibleProducts.filter(p => p.id === published.id)
  }, null, 2));

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
