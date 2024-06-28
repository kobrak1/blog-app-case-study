const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')

// mongodb config and connection
mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('Connected to mongodb')
    })
    .catch((error) => {
        console.log('Error connecting to mongodb:', error.message)
    })

// middlewares
app.use(cors())
app.use(express.json())
app.use(middleware.reqLogger)
app.use(middleware.tokenExtractor)

// routers
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app