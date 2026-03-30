import express from 'express'
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller'
import { authenticateToken } from '../middleware/auth.middleware'

const router = express.Router()

router.get('/', getProducts)
router.get('/:id', getProduct)
router.post('/', authenticateToken, createProduct)
router.put('/:id', authenticateToken, updateProduct)
router.delete('/:id', authenticateToken, deleteProduct)

export default router
