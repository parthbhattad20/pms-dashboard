import express from 'express'
import mongoose from 'mongoose'
import app from './app.js'
import 'dotenv/config'

const port = 8000;

mongoose.connect(process.env.MONGO,{useNewUrlParser:true})
.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
    console.log('mongodb database connected')
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error)
})
