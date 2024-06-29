const config = require('./utils/config')
const middleware = require('./utils/middleware')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const reset =require('./utils/resetBlogCount')

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

// Initialize cron job if not already initialized
if(!reset.isInitialized) {
  reset.resetBlogCount()
}

module.exports = app