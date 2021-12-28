const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new localStrategy({
        usernameField: 'email',
    }, function(email, password, done){
        User.findOne({
            email: email
        }, (err, user) => {
            if(err){
                console.log("Error in PASSPORT", err); 
                return done(err);
            }

            if(!user || user.password !== password){
                console.log("Invalid Username/Password");
                return done(null, false);
            }

            return done(null, user);
        });
}));    


passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findOne({
        _id: id
    }, (err, user) => {
        if(err){
            console.log(err);
            return done(err);
        }
        return done(null, user);
    });
});

passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/users/signin');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    return next();
}

module.exports = passport;