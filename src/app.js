import dotenv from 'dotenv'
import express, { json } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import service from './routes/services.js'

dotenv.config({
    path: './.env'
})

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.static("public"))
app.use(json())
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())

//router
app.use("/api/v1/service", service)
export { app }