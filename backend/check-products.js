const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { category: true }
  });
  console.log('--- PRODUCTS IN DB ---');
  console.log(JSON.stringify(products, null, 2));
  console.log('----------------------');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
