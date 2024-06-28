const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    slug: String,
    title: {
        type: String,
        minLength: 5,
        required: true
    },
    content: {
        type: String,
        minLength: 5,
        required: true
    },
    updated_at: Date,
    created_at: Date,
})

blogSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Blog', blogSchema)