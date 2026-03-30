import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { z } from 'zod'
import { ProductStatus } from '@prisma/client'

const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  status: z.nativeEnum(ProductStatus).optional(),
  featured: z.boolean().optional()
})

const updateProductSchema = createProductSchema.partial()

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search, category, status } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ]
    }
    
    if (category) where.category = category
    if (status) where.status = status

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.product.count({ where })
    ])

    res.json({
      products,
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

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const product = await prisma.product.findUnique({
      where: { id: String(id) },
      include: {
        orderItems: {
          include: {
            order: true
          }
        }
      }
    })

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const data = createProductSchema.parse(req.body)
    
    const product = await prisma.product.create({
      data: {
        ...data,
        tags: data.tags || [],
        images: data.images || []
      }
    })

    res.status(201).json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const data = updateProductSchema.parse(req.body)
    
    const updateData: any = { ...data }
    if (data.tags !== undefined) updateData.tags = data.tags
    if (data.images !== undefined) updateData.images = data.images
    
    const product = await prisma.product.update({
      where: { id: String(id) },
      data: updateData
    })

    res.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    await prisma.product.delete({
      where: { id: String(id) }
    })

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
