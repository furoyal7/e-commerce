import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
