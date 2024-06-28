const logger = require('./logger')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const reqLogger = (req, res, next) =>{
    logger.info('Method:', req.method)
    logger.info('Path:', req.path)
    logger.info('Body:', req.body)
    logger.info('-----')
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).end()
}

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return res.status(404).send({ error: 'malforatted id' })
    } else if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message })
    } else if ( error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
      return res.status(400).json({ error: 'expected username to be unique' })
    } else if ( error.name === 'JsonWebTokenError' ) {
      return res.status(400).json({ error: 'token missing or invalid' })
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'token expired' })
    }
  
    next(error)
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
  
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
      const token = authorization.substring(7)

      // decode the token got from req.body and assign it as 'req.token'
      req.token = jwt.verify(token, process.env.SECRET_KEY)
  
      if (!req.token.id) {
        return res.statusU(404).json({ error: 'token missing or invalid' })
      }
  
      next()
    } else next()
}

const userExtractor = async (req, res, next) => {
    req.user = await User.findById(req.token.id)
  
    next()
}

const blogExtractor = async (req, res, next) => {
    req.blog = await Blog.findById(req.params.id)

    next()
}

// middleware to check if user reached the blog creation limit
const blogLimit = async (req, res, next) => {
  try {
    const user = req.user
    logger.info('USER:', user.created_at)

    if(!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // check user already created 3 blogs today
    if(user.blogsCreatedToday >= 3333) {
      return res.status(403).json({ error: 'Maximum limit of 3 blogs per day reached' } )
    }

    next()
  } catch (error) {
    console.error('Error checking blog creation limit:', error.message)
    res.status(500).json({ error: 'Internal Server Error' })

    next(error)
  }
}

module.exports = {
    reqLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor,
    blogExtractor,
    blogLimit,
}