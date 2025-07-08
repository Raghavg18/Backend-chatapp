import express from 'express'
import { signup, login, logout, getUserProfile } from '../Controllers/User.controller.js'
import secureRoute from '../Middleware/secureRoute.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.get('/getUserProfile',secureRoute ,getUserProfile)

export default router