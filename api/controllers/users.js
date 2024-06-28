const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const logger = require('../utils/logger')

// get all users
usersRouter.get('/', async (req, res) => {
    try {
        const users = await User.find({}).populate('blogs', { content: 1, created_at: 1 })
        res.status(200).json(users)
    } catch (error) {
        console.error('Error caught while getting users')
        res.status(500).json({error: 'Error wjile getting users'})
    }
})

// get a specific user
usersRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id).populate('blogs', { content: 1, created_at: 1 })
        if(user === null) {
            return res.status(404).json({error: 'There is not a user with specified id'})
        }
        logger.info('BLOGS:', user.blogs)
    
        res.status(200).json(user)
    } catch (error) {
        console.error('Error caught while getting user info:', error)
        res.status(500).json({error: 'Error wjile getting user info'})
    }
})

// post a new user
usersRouter.post('/', async (req, res) => {
    const { name, email, password } = req.body
    if(!name || !email || !password) {
        return res.status(400).json({error: 'Name, email, and password are required'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        name,
        email,
        passwordHash,
        created_at: new Date(),
        updated_at: new Date()
    })

    try {
        const savedUser = await user.save()
        if(!savedUser) {
            return res.status(404).json({error: 'Error while posting the blog'})
        }

        res.status(201).json(savedUser)
    } catch (error) {
        console.error('Error caught while creating the user:', error.message)
        res.status(500).json({error: 'Internal Server Error'})
    }
})

module.exports = usersRouter