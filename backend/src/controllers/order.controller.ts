import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { z } from 'zod'
import { OrderStatus } from '@prisma/client'

const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus)
})

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const where: any = {}
    
    if (search) {
      where.OR = [
        { id: { contains: search as string } }
      ]
    }
    
    if (status) where.status = status

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true
                }
              }
            }
          }
        }
      }),
      prisma.order.count({ where })
    ])

    res.json({
      orders,
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

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const order = await prisma.order.findUnique({
      where: { id: String(id) },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = updateOrderStatusSchema.parse(req.body)
    
    const order = await prisma.order.update({
      where: { id: String(id) },
      data: { status }
    })

    res.json(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
}
