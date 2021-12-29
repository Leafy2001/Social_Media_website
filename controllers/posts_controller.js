const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.create = async (req, res) => {
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user.id
        });
        
        let user = await User.findById(req.user.id).select('name avatar');
        if(req.xhr){
            return res.status(200).json({
                data: {
                    post: post,
                    user: user
                },
                message: "POST CREATED"
            });
        }
        req.flash('success', "POST CREATED");
    }catch(err){
        console.log(err);
        if(req.xhr){
            return res.status(400).json({
                message: "POST NOT CREATED"
            });
        }
        req.flash('error', "POST NOT CREATED");
        return res.redirect('/');
    }
};

module.exports.destroy = async (req, res) => {
    let post_id = req.params.post_id;
    let user = req.user.id;

    try{
        let post = await Post.findById(post_id);
        if(post.user != user){
            console.log("USER MISMATCH");
            return res.redirect('/');
        }

        for(like_id of post.likes){
            await Like.deleteOne({_id: like_id});
        }
        for(comment_id of post.comments){
            let comment = await Comment.findById(comment_id);
            for(like_id of comment.likes){
                await Like.deleteOne({_id: like_id});
            }
        }

        await post.remove();
        await Comment.deleteMany({post:post_id});
        
        if(req.xhr){
            return res.status(200).json({
                data: {
                    post_id: post_id
                },
                message: "POST DELETED"
            });
        }
        req.flash('success', 'Post Deleted Successfully');
        return res.redirect('/');
    }catch(err){
        console.log(err);
        if(req.xhr){
            return res.status(400).json({
                message: "POST NOT DELETED"
            });
        }
        req.flash('error', 'Post Not Deleted');
        return res.redirect('/');
    }
};