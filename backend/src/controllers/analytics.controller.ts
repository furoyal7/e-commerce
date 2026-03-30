import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { period = '30d' } = req.query
    
    let dateFilter: any = {}
    const now = new Date()
    
    switch (period) {
      case '7d':
        dateFilter = { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
        break
      case '30d':
        dateFilter = { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
        break
      case '90d':
        dateFilter = { gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) }
        break
      default:
        dateFilter = { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
    }

    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      activeProducts,
      recentOrders
    ] = await Promise.all([
      prisma.order.aggregate({
        where: {
          createdAt: dateFilter,
          status: 'DELIVERED'
        },
        _sum: {
          total: true
        }
      }),
      prisma.order.count({
        where: {
          createdAt: dateFilter
        }
      }),
      prisma.customer.count({
        where: {
          createdAt: dateFilter
        }
      }),
      prisma.product.count({
        where: {
          status: 'ACTIVE'
        }
      }),
      prisma.order.findMany({
        where: {
          createdAt: dateFilter
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      })
    ])

    const averageOrderValue = totalOrders > 0 ? (totalRevenue._sum.total || 0) / totalOrders : 0

    res.json({
      stats: {
        totalRevenue: totalRevenue._sum.total || 0,
        totalOrders,
        totalCustomers,
        activeProducts,
        averageOrderValue,
        conversionRate: totalCustomers > 0 ? ((totalOrders / totalCustomers) * 100).toFixed(2) : '0'
      },
      recentOrders
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getRevenueAnalytics = async (req: Request, res: Response) => {
  try {
    const { period = '30d', groupBy = 'day' } = req.query
    
    let dateFilter: any = {}
    let dateFormat: string = '%Y-%m-%d'
    
    const now = new Date()
    switch (period) {
      case '7d':
        dateFilter = { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
        break
      case '30d':
        dateFilter = { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
        break
      case '90d':
        dateFilter = { gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) }
        dateFormat = '%Y-%u'
        break
      default:
        dateFilter = { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
    }

    const revenueByPeriod = await prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(created_at, '${dateFormat}') as period,
        SUM(total) as revenue,
        COUNT(*) as orders
      FROM orders 
      WHERE created_at >= ${dateFilter.gte.toISOString()}
        AND status = 'DELIVERED'
      GROUP BY DATE_FORMAT(created_at, '${dateFormat}')
      ORDER BY period ASC
    `

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: dateFilter,
          status: 'DELIVERED'
        }
      },
      _sum: {
        quantity: true
      },
      _count: true,
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 10
    })

    res.json({
      revenueByPeriod,
      topProducts
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getProductAnalytics = async (req: Request, res: Response) => {
  try {
    const { period = '30d' } = req.query
    
    let dateFilter: any = {}
    const now = new Date()
    
    switch (period) {
      case '7d':
        dateFilter = { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
        break
      case '30d':
        dateFilter = { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
        break
      case '90d':
        dateFilter = { gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) }
        break
      default:
        dateFilter = { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
    }

    const productPerformance = await prisma.product.findMany({
      include: {
        items: {
          where: {
            order: {
              createdAt: dateFilter,
              status: 'DELIVERED'
            }
          },
          _sum: {
            quantity: true
          },
          _count: true
        }
      },
      orderBy: {
        items: {
          _sum: {
            quantity: 'desc'
          }
        }
      },
      take: 50
    })

    const formattedProducts = productPerformance.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      totalSold: product.items?._count || 0,
      totalQuantity: product.items?._sum.quantity || 0,
      revenue: (product.items?._sum.quantity || 0) * product.price,
      rating: 0 // TODO: Calculate from reviews
    }))

    res.json(formattedProducts)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
