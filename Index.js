import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRoute from './Routes/User.route.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import messageRoute from './Routes/message.route.js'
import { app, server } from './Socketio/Server.js'

// const app = express()
dotenv.config()


app.use(express.json())
app.use(cors());
app.use(cookieParser())

const PORT = process.env.PORT || 5002
const URI = process.env.MONGODB_URI

try {
  mongoose.connect(URI)
  console.log("MongoDB connected successfully")
} catch (error) {
  console.error("MongoDB connection failed:", error.message)
}

app.use("/api/user", userRoute)
app.use("/api/message", messageRoute)

// if(process.env.NODE_ENV === "production"){
//     const dirpath = path.resolve();
//     app.use(express.static('./vite-project/dist'))
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(dirpath, './vite-project/dist','index.html'))
//     })
// }

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
