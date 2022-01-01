const User = require('../models/user');
const path = require('path');
const fs = require('fs');

const cloudinary_config = require('../config/cloudinary_config');
const cloudinary = require('cloudinary');

const uploader = async (path) => await cloudinary_config.uploads(path, 'User_Images');

module.exports.profile = async function(req, res){
    try{
        let user_id = req.params.id;

        let profile_user = await User.findById(user_id);
        if(!profile_user){
            console.log("PROFILE USER NOT FOUND");
            return res.redirec('/');
        }
        
        let user = await User.findById(req.user.id);

        let is_f = true;
        let index = user.following.indexOf(profile_user._id);
        if(index == -1){is_f = false;}

        return res.render('user_profile', {
            title: "Profile | " + profile_user.name,
            curr_user: profile_user,
            following : is_f
        });
    }catch(err){
        console.log(err);
        return res.redirec('/');
    }
};


module.exports.signUp = (req, res) => {
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_signup.ejs', {
        'title': 'Codeial | Sign Up'
    });
};

module.exports.signIn = (req, res) => {
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_signin.ejs', {
        'title': 'Codeial | Sign In'
    })
};


module.exports.create = (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let pass = req.body.password;
    let cp = req.body.c_p;
    
    if(pass != cp){
        req.flash('error', 'Password and Confirm Password do not match.');
        return res.redirect('back');
    }
    User.findOne({
        email: email
    }, (err, user) => {
        if(err){
            console.log("ERROR");
            req.flash('error', 'Internal Server Error');
            return res.redirect('back');
        }
        if(!user){
            const AVATAR_PATH = '/uploads/users/avatars/default.png';
            User.create({
                email: email,
                password: pass,
                name: name,
                avatar : AVATAR_PATH
            }, (err, user) => {
                req.flash('error', 'Internal Server Error');
                if(err){console.log(err); return;}
            });
            req.flash('success', 'User Successfully Signed up');
            return res.redirect('/users/signin');
        }
        req.flash('error', 'User Already Exists');
        console.log("USER EXISTS");
        return res.redirect('/users/signup');
    });
};

module.exports.createSession = (req, res) => {
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
};


module.exports.signout = (req, res) => {
    if(!req.isAuthenticated()){
        return res.redirect('/users/signin');
    }
    req.flash('success', 'Logged Out');
    req.logout();
    return res.redirect('/');
}

module.exports.update = async (req, res) => {
    try{
        let user = await User.findById(req.user.id);
        const AVATAR_PATH = path.join('/uploads/users/avatars');
        
        if(req.body.name.length > 0){
            user.name = req.body.name;
        }
        if(req.file){
            file_path = path.join('/uploads/users/avatars', '/' , req.file.filename);
            let local_path = file_path;
            file_path = await uploader(path.join(__dirname, '..', file_path));
            fs.unlinkSync(path.join(__dirname, '..', local_path));

            if(user.avatar && user.avatar_public_id){
                // DELETE FILE
                await cloudinary.uploader.destroy(user.avatar_public_id);
            }
            user.avatar = file_path.url;
            user.avatar_public_id = file_path.id;
        }
        user.save();

        req.flash('success', 'Profile Successfully updated');
        return res.redirect('back');
    }catch(err){
        console.log(err);
        return res.redirect('/');
    }
};

module.exports.follow = async function (req, res) {
    let follow_id = req.params.id;
    let follow_user = await User.findById(follow_id);
    if(!follow_user){
        console.log("WRONG FOLLOW ID");
        return res.redirect('back');
    }

    let user = await User.findById(req.user.id);
    let index = user.following.indexOf(follow_id);
    
    if(index == -1){
        user.following.push(follow_id);
        // console.log("Followed ID: ", follow_id);
    }else{
        user.following.splice(index, 1);
        // console.log("Unfollowed ID: ", follow_id);
    }

    await user.save();
    return res.redirect('back');
}