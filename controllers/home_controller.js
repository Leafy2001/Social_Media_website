const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res){
    // Async await Code
    try{
        if(!req.user){
            let posts = await Post.find()
            .sort('-createdAt')
            .populate('user', 'name avatar')
            .populate({
                path: 'comments',
                select: 'user content likes createdAt',
                options: {
                    sort:{
                        createdAt: -1
                    }
                },
                populate: {
                    path: 'user',
                    select: 'name avatar'
                }
            });
            posts.forEach((post) => {
                if(post.pic){
                    let PIC = JSON.parse(post.pic);
                    post.pic = PIC.url;
                }
            });
            let users = await User.find({});

            return res.render('home.ejs', {
                title: 'Codeial | Home',
                posts: posts,
                all_users: users
            });
        }
        let user = await User.findById(req.user.id);
        

        let following = user.following;
        following.push(req.user.id)
        // console.log(following);

        let posts = await Post.find({
                            user: {
                                $in: following
                            }
                        })
                        .sort('-createdAt')
                        .populate('user', 'name avatar')
                        .populate({
                            path: 'comments',
                            select: 'user content likes createdAt',
                            options: {
                                sort:{
                                    createdAt: -1
                                }
                            },
                            populate: {
                                path: 'user',
                                select: 'name avatar'
                            }
                        });
        
        let users = await User.find({});
        posts.forEach((post) => {
            if(post.pic){
                let PIC = JSON.parse(post.pic);
                post.pic = PIC.url;
            }
        });
        return res.render('home.ejs', {
            title: 'Codeial | Home',
            posts: posts,
            all_users: users
        });
    }catch(err){
        req.flash('error', "SERVER ERROR");
        console.log(err);
        return;
    }

};


// module.exports.actionName = function(req, res){}