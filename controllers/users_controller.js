const User = require('../models/user');
const path = require('path');
const fs = require('fs');

module.exports.profile = function(req, res){
    let user_id = req.params.id;
    User.findById(user_id, (err, user) => {
        if(err){
            console.log(err);
        }
        return res.render('user_profile', {
            title: "Profile | " + user.name,
            curr_user: user
        });
    });
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
            console.log(req.file);
            if(user.avatar && fs.existsSync(path.join(__dirname, '..', user.avatar))){
                fs.unlinkSync(path.join(__dirname, '..', user.avatar));
            }
            user.avatar = path.join(AVATAR_PATH, '/', req.file.filename)
        }
        user.save();

        req.flash('success', 'Profile Successfully updated');
        return res.redirect('back');
    }catch(err){
        console.log(err);
        return res.redirect('/');
    }
};
