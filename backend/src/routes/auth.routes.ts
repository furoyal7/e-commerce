import express from 'express'
import { login, getProfile } from '../controllers/auth.controller'
import { authenticateToken } from '../middleware/auth.middleware'

const router = express.Router()

router.post('/login', login)
router.get('/profile', authenticateToken, getProfile)

export default router
