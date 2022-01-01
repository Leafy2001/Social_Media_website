const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');
const fs = require('fs');
const path = require('path');
const cloudinary_config = require('../config/cloudinary_config');
const cloudinary = require('cloudinary');

const uploader = async (path) => await cloudinary_config.uploads(path, 'Post_Images');

module.exports.create = async (req, res) => {
    try{
        let file_path;
        if(req.file){
            file_path = path.join('/uploads/users/posts', '/' , req.file.filename);
            let local_path = file_path;
            file_path = await uploader(path.join(__dirname, '..', file_path));
            fs.unlinkSync(path.join(__dirname, '..', local_path));
        }

        let post = await Post.create({
            content: req.body.content,
            user: req.user.id,
            pic: JSON.stringify(file_path)
        });
        
        let user = await User.findById(req.user.id).select('name avatar');
        if(req.xhr){
            return res.status(200).json({
                data: {
                    post: post,
                    user: user,
                    pic: file_path.url
                },
                message: "POST CREATED"
            });
        }
        req.flash('success', "POST CREATED");
        return res.redirect('/');
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

        if(post.pic){
            let fp = JSON.parse(post.pic);
            await cloudinary.uploader.destroy(fp.id);
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