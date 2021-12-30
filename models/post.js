const mongoose = require('mongoose');


const postSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            required: true
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ],
    pic: {
        type: String,
        required: false
    }
}, {timestamps: true});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
