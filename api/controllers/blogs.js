const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const { userExtractor, blogExtractor, blogLimit, isUniqueSlug } = require('../utils/middleware')
const slugify = require('slugify')


// get all blogs
blogsRouter.get('/', async (req, res, next) => {
    try {
        const blogs = await Blog.find({}).populate('user_id', { name: 1, email: 1 })
        res.status(200).json(blogs)
    } catch (error) {
        console.error('Error creating a post:', error.message)
        res.status(500).json({error: 'Internal Server Error'})

        next(error)
    }
})

// get a blog with specified id
blogsRouter.get('/:slug', async (req, res, next) => {
    try {
        const slug = req.params.slug
        const blog = await Blog.findOne({ slug }).populate('user_id', { name: 1, email: 1 })
        if(blog === null) {
            return res.status(404).json({error: 'There is not a blog with the specified id'})
        }

        res.status(200).json(blog)
    } catch (error) {
        console.error('Error while getting the blog info:', error.message)
        res.status(500).json({error: 'Error while getting the blog info'})

        next(error)
    }
})

// post a new blog
blogsRouter.post('/', userExtractor, blogLimit, isUniqueSlug, async (req, res, next) => {
    const body = req.body
    const user = req.user // variable from userExtractor
    const slug = req.slug // variable from isUniqueSlug

    try {
        // check if content missing
        if(!body.content) {
            return res.status(400).json({error: 'content missing'})
        }
    
        const blog = new Blog({
            user_id: user._id,
            slug: slug,
            title: body.title,
            content: body.content,
            updated_at: new Date(),
            created_at: new Date(),
        })

        const savedBlog = await blog.save()

        user.blogsCreatedToday += 1
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        res.status(201).json(savedBlog)
    } catch (error) {
        next(error)
    }
})

// delete all blogs
blogsRouter.delete('/', async (req, res, next) => {
    await Blog.deleteMany({})
    res.status(204).send('All blogs has been removed')

    next()
})

// delete a specific blog
blogsRouter.delete('/:id', blogExtractor, async (req, res, next) => {
    try {        
        const authorId = req.blog.user_id.toString()
        const userId = req.token.id  // tokenExtractor function has already been imported to app.js
    
        if(authorId === userId) {
            await Blog.findByIdAndDelete(req.params.id)
            return res.status(204).end()
        }
        
        res.status(403).send({ error: "You are not allowed to delete someone else's blog" })
    } catch (error) {
        next(error)
    }
})

// update a specific blog
blogsRouter.put('/:id', async (req, res, next) => {
    const {  title, content} = req.body
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true, runValidators: true, context: 'query' }
        )

        // respond with the updated note as JSON
        res.status(200).json(updatedBlog)
    try {
        
    } catch (error) {
        next(error)
    }
})

module.exports = blogsRouter

