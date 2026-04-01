import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

async function testAuth() {
  try {
    console.log('Testing authentication...')
    
    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    })
    
    console.log('Admin user found:', adminUser)
    
    if (!adminUser) {
      console.log('Creating admin user...')
      const hashedPassword = await bcrypt.hash('admin123', 10)
      
      const newUser = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          password: hashedPassword,
          role: 'ADMIN'
        }
      })
      
      console.log('Admin user created:', newUser)
    }
    
    // Test login
    const testUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    })
    
    if (testUser) {
      const isValidPassword = await bcrypt.compare('admin123', testUser.password)
      console.log('Password valid:', isValidPassword)
      
      if (isValidPassword) {
        const token = jwt.sign(
          { userId: testUser.id, email: testUser.email, role: testUser.role },
          'your-secret-key',
          { expiresIn: '7d' }
        )
        console.log('Test token:', token)
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAuth()
