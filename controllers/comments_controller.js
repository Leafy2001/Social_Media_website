const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');
const comments_mailer = require('../mailers/comments_mailer');

module.exports.createComment = async (req, res) => {
    try{
        let content = req.body.content;
        let post_id = req.body.post;
        let user = req.user._id;

        let post = await Post.findById(post_id);
        let comment = await Comment.create({
            content: content,
            post: post_id,
            user: user
        });
        comment = await comment.populate('user', 'name email').execPopulate();

        await post.comments.push(comment);
        await post.save();

        await comments_mailer.newComment(comment);

        if(req.xhr){
            return res.status(200).json({
                message: "COMMENT ADDED",
                data: {
                    comment: comment
                }
            })
        }

        req.flash('success', 'Comment Successfully Added');
        return res.redirect('/');
    }catch(err){
        console.log(err);
        return res.redirect('/');
    }
};

module.exports.destroy = async (req, res) => {
    try{
        let c_id = req.params.comment_id;
        let user_id = req.user.id;

        let comment = await Comment.findById(c_id);
        if(comment.user != user_id){
            req.flash('error', 'Comment Not Deleted');
            return res.redirect('/');
        };
        let post_id = comment.post;

        for(like_id of comment.likes){
            await Like.deleteOne({_id: like_id});
        }

        await comment.remove();

        let post = await Post.findById(post_id);
        const index = post.comments.indexOf(c_id);
        if(index > -1){
            await post.comments.splice(index, 1);
            await post.save();
        }
        
        req.flash('success', 'Comment Successfully Deleted');
        return res.redirect('/');
    }catch(err){
        console.log(err);
        return res.redirect('/');
    }
};
