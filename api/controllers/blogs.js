const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { error } = require('../utils/logger')
const { userExtractor, blogExtractor } = require('../utils/middleware')
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
blogsRouter.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const blog = Blog.findById(id)
        if(blog === null) {
            return res.status(404).json({error: 'There is not a blof with the specified id'})
        }

        res.status(200).json(blog)
    } catch (error) {
        console.error('Error while getting the blog info:', error.message)
        res.status(500).json({error: 'Error while getting the blog info'})

        next(error)
    }
})

// post a new blog
blogsRouter.post('/', userExtractor, async (req, res, next) => {
    const body = req.body
    const user = req.user // variable from userExtractor

    try {
        // check if content missing
        if(!body.content) {
            return res.status(400).json({error: 'content missing'})
        }
        
        // generate a slug from the title
        const slug = slugify(body.title, { lower: false })
    
        const blog = new Blog({
            user_id: user._id,
            slug: slug,
            title: body.title,
            content: body.content,
            updated_at: new Date(),
            created_at: new Date(),
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        res.status(201).json(savedBlog)
    } catch (exception) {
        next(exception)
    }
})

// delete all blogs
blogsRouter.delete('/', async (req, res, next) => {
    await Blog.deleteMany({})
    res.status(204).send('All blogs has been removed')

    next(error)
})

// delete a specific blog
blogsRouter('/:id', blogExtractor, async (req, res, next) => {
    try {        
        const authorId = req.blog.user_id.toString()
        const userId = req.token.id  // tokenExtractor function has already been imported to app.js
    
        if(authorId === userId) {
            await Blog.findByIdAndDelete(req.params.id)
            return res.status(204).end()
        }
        
        res.status(204).send({ error: "You are not allowed to delete someone else's blog" })
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

