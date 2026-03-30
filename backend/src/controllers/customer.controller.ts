import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

const updateCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatar: z.string().optional(),
  segment: z.enum(['REGULAR', 'VIP', 'RETURNING', 'INACTIVE']).optional(),
  notes: z.string().optional()
})

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search, segment } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ]
    }
    
    if (segment) where.segment = segment

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          orders: {
            select: {
              id: true,
              total: true,
              status: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              reviews: true
            }
          }
        }
      }),
      prisma.customer.count({ where })
    ])

    res.json({
      customers,
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

export const getCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const customer = await prisma.customer.findUnique({
      where: { id: String(id) },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
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
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            status: true,
            createdAt: true
          }
        }
      }
    })

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    res.json(customer)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const data = updateCustomerSchema.parse(req.body)
    
    const customer = await prisma.customer.update({
      where: { id: String(id) },
      data
    })

    res.json(customer)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
}
