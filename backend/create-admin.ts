import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    console.log('Creating admin user...')
    
    // Delete existing admin user if exists
    await prisma.user.deleteMany({
      where: { email: 'admin@example.com' }
    })
    
    // Create new admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
    
    console.log('Admin user created successfully:', adminUser)
    
    // Create some sample products
    const products = [
      {
        name: 'Wireless Headphones',
        slug: 'wireless-headphones',
        description: 'Premium noise-cancelling wireless headphones',
        price: 299.99,
        stock: 45,
        tags: ['wireless', 'bluetooth'],
        images: [],
        status: 'published' as const,
        featured: true
      },
      {
        name: 'Laptop Stand',
        slug: 'laptop-stand',
        description: 'Adjustable aluminum laptop stand',
        price: 49.99,
        stock: 120,
        tags: ['ergonomic', 'aluminum'],
        images: [],
        status: 'published' as const,
        featured: false
      }
    ]
    
    for (const product of products) {
      await prisma.product.create({
        data: product
      })
    }
    
    console.log('Sample products created successfully')
    
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
