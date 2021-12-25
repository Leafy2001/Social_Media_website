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
        return res.redirect('back');
    }
    User.findOne({
        email: email
    }, (err, user) => {
        if(err){
            console.log("ERROR");
            return res.redirect('back');
        }
        if(!user){
            User.create({
                email: email,
                password: pass,
                name: name
            }, (err, user) => {
                if(err){console.log(err); return;}
            });
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
        
        user.name = req.body.name;
        user.email = req.body.email;
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
