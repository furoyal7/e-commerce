const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('--- STEP 1: RESET TEST DATA ---');
  await prisma.product.deleteMany({ where: { name: 'DEBUG_TOOL_V1' } });

  console.log('--- STEP 2: ENSURE CATEGORY EXISTS ---');
  let category = await prisma.category.findFirst({ where: { slug: 'debug-cat' } });
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Debug Category',
        slug: 'debug-cat',
      }
    });
  }

  console.log('--- STEP 3: CREATE DRAFT PRODUCT ---');
  const draft = await prisma.product.create({
    data: {
      name: 'DEBUG_TOOL_V1',
      slug: 'debug-tool-v1-' + Date.now(),
      description: 'Principal Debugging Tool',
      price: 99.99,
      categoryId: category.id,
      image: 'https://example.com/img.jpg',
      status: 'draft',
    },
  });
  console.log('DB Record (Draft):', JSON.stringify(draft, null, 2));

  console.log('--- STEP 4: PUBLISH PRODUCT ---');
  const published = await prisma.product.update({
    where: { id: draft.id },
    data: { status: 'published' },
  });
  console.log('DB Record (Published):', JSON.stringify(published, null, 2));

  console.log('--- STEP 5: VERIFY API VISIBILITY (MOCK) ---');
  const visibleProducts = await prisma.product.findMany({
    where: { status: 'published' },
  });
  
  const result = {
    success: true,
    products: visibleProducts.filter(p => p.id === published.id)
  };
  
  console.log('API Response Simulation:');
  console.log(JSON.stringify(result, null, 2));

  if (result.products.length > 0 && result.products[0].status === 'published') {
    console.log('✅ VERIFICATION SUCCESSFUL: Product is visible on frontend simulation.');
  } else {
    console.error('❌ VERIFICATION FAILED: Product not found or not published.');
    process.exit(1);
  }

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
