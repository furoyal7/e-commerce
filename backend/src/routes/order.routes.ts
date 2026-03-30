import express from 'express'
import { getOrders, getOrder, updateOrderStatus } from '../controllers/order.controller'
import { authenticateToken } from '../middleware/auth.middleware'

const router = express.Router()

router.get('/', getOrders)
router.get('/:id', getOrder)
router.put('/:id/status', authenticateToken, updateOrderStatus)

export default router
