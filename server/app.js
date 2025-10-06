import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import appRouter from './routes/index.js'


const app = express ()
app.use (express.json ())
app.use (cookieParser ())
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your client URL
    credentials : true,
    optionsSuccessStatus: 200
}
app.use (cors (corsOptions))

app.use("/api",appRouter)


app.get('/', (req, res) => {
    res.send('API is running...')
})

export default app
