const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res){
    // Async await Code
    try{
        let posts = await Post.find({})
                        .sort('-createdAt')
                        .populate('user', 'name')
                        .populate({
                            path: 'comments',
                            select: 'user content likes',
                            populate: {
                                path: 'user',
                                select: 'name'
                            }
                        });
        
        let users = await User.find({});

        return res.render('home.ejs', {
            title: 'Codeial | Home',
            posts: posts,
            all_users: users
        });
    }catch(err){
        console.log(err);
        return;
    }

};


// module.exports.actionName = function(req, res){}