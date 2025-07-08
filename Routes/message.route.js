import express from 'express'
import { getMessage, sendMessage } from '../Controllers/message.controller.js'
import secureRoute from '../Middleware/secureRoute.js'
// import { get } from 'mongoose'

const router = express.Router()
router.post('/send/:id',secureRoute , sendMessage)
router.get('/get/:id',secureRoute, getMessage)

export default router