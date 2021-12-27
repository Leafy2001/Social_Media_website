const Post = require('../models/post');
const Like = require('../models/like');
const Comment = require('../models/comment');


// likes/toggle?id=abcdef&type=Post
module.exports.toggle = async (req, res) => {
    try{
        let likeable;
        let deleted = false;
        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id)
                            .populate('likes');

        }else if(req.query.type == 'Comment'){
            likeable = await Comment.findById(req.query.id)
                            .populate('likes');
        }else{
            return res.status(500).json({
                message: "Invalid Request"
            });
        }

        let like = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user.id
        });

        if(like){
            await likeable.likes.pull(like._id);
            await like.remove();
            await likeable.save();
            deleted = true;

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        deleted: deleted,
                        model: req.query.type,
                        likeable: req.query.id,
                        count: likeable.likes.length
                    },
                    message: "LIKE REMOVED"
                });
            }

            req.flash('success', 'Like Removed');
            return res.redirect('/');
        }else{
            let newLike = await Like.create({
                user: req.user.id,
                onModel: req.query.type,
                likeable: req.query.id
            });
            await likeable.likes.push(newLike.id);
            await likeable.save();
            
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        deleted: deleted,
                        model: req.query.type,
                        likeable: req.query.id,
                        count: likeable.likes.length
                    },
                    message: "LIKE ADDED"
                });
            }
            
            req.flash('success', 'Like Added');
            return res.redirect('/');
        }

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
