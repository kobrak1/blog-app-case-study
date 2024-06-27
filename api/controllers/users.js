const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

// get all users
usersRouter.get('/', async (req, res) => {
    const users = await User.find({})
    res.status(200).json(users)
})

// get a specific user
usersRouter.get('/:id', async (req, res) => {
    const id = req.params.id
    const user = await User.find(id)
    res.status(200).json(user)
})

// post a new user
usersRouter.post('/', async (req, res) => {
    const { name, email, password } = req.body

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
        res.status(201).json(savedUser)
    } catch (error) {
        console.error('Error caught while creating the user:', error.message)
    }
})

module.exports = usersRouter