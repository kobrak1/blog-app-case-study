const express = require('express')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const mongoose = require('mongoose')
const loginRouter = require('./controllers/login')
require('dotenv').config()

mongoose.set('strictQuery', false)

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to mongodb')
    })
    .catch((error) => {
        console.log('Error connecting to mongodb:', error.message)
    })

app.use(cors())
app.use(express.json())

// routers
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

module.exports = app