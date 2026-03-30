import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

const createDiscountSchema = z.object({
  code: z.string().min(1),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING']),
  value: z.number().positive(),
  minAmount: z.number().positive().optional(),
  maxUses: z.number().int().positive().optional(),
  expiresAt: z.string().datetime().optional()
})

const updateDiscountSchema = createDiscountSchema.partial()

export const getDiscounts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const where: any = {}
    
    if (search) {
      where.OR = [
        { code: { contains: search as string, mode: 'insensitive' } }
      ]
    }

    const [discounts, total] = await Promise.all([
      prisma.discount.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.discount.count({ where })
    ])

    res.json({
      discounts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const createDiscount = async (req: Request, res: Response) => {
  try {
    const data = createDiscountSchema.parse(req.body)
    
    const discount = await prisma.discount.create({
      data: {
        ...data,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null
      }
    })

    res.status(201).json(discount)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const data = updateDiscountSchema.parse(req.body)
    
    const updateData: any = { ...data }
    if (data.expiresAt) updateData.expiresAt = new Date(data.expiresAt)
    
    const discount = await prisma.discount.update({
      where: { id: String(id) },
      data: updateData
    })

    res.json(discount)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const deleteDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    await prisma.discount.delete({
      where: { id: String(id) }
    })

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
