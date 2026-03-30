import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { z } from 'zod'
import { ReviewStatus } from '@prisma/client'

const createReviewSchema = z.object({
  productId: z.string().min(1),
  customerId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional()
})

const updateReviewSchema = z.object({
  status: z.nativeEnum(ReviewStatus)
})

export const getReviews = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const where: any = {}
    
    if (search) {
      where.OR = [
        { comment: { contains: search as string, mode: 'insensitive' } },
        { customer: { name: { contains: search as string, mode: 'insensitive' } } }
      ]
    }
    
    if (status) where.status = status

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          product: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }),
      prisma.review.count({ where })
    ])

    res.json({
      reviews,
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

export const updateReviewStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = updateReviewSchema.parse(req.body)
    
    const review = await prisma.review.update({
      where: { id: String(id) },
      data: { status }
    })

    res.json(review)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    await prisma.review.delete({
      where: { id: String(id) }
    })

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
