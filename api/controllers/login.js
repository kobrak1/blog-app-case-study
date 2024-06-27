const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    const isPasswordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)
    
    if(!(user &&  isPasswordCorrect)) {
        return res.status(401).json({error: 'invalid email or password'})
    }

    const userForToken = {
        email: email,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET_KEY, { expiresIn: 60*60 })  // token expires in an hour

    res
      .status(200)
      .send({ 
        token, 
        email: user.email, 
        name: user.name
      })
})

module.exports = loginRouter