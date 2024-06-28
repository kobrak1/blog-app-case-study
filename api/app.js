const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const cron = require('node-cron')

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

// Schedule the task to reset blogsCreatedToday at midnight every day
cron.schedule('0 0 * * *', async () => {
    try {
      const result = await User.updateMany({}, { $set: { blogsCreatedToday: 0 } })
      logger.info(`Reset blogsCreatedToday for ${result.modifiedCount} users.`)
    } catch (error) {
      logger.error('Error resetting blogsCreatedToday:', error.message)
    }
  })

// routers
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app