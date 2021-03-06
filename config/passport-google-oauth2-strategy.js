const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALL_BACK_URL
}, function(accessToken, refreshToken, profile, done) {
    User.findOne({
        email: profile.emails[0].value
    }).exec(function(err, user){
        if(err){
            console.log("GOOGLE ERROR");
            console.log(err);
            return;
        }
        // console.log(profile);
        if(user){
            if(!user.avatar){
                user.avatar = profile.photos[0].value
                user.save();
            }
            return done(null, user);
        }else{
            User.create({
                email: profile.emails[0].value,
                name: profile.displayName,
                password: crypto.randomBytes(20).toString('hex'),
                avatar: profile.photos[0].value
            }, (err, user) => {
                if(err){
                    console.log("GOOGLE USER CREATION ERROR");
                    console.log(err);
                    return;
                }
                return done(null, user);
            })
        }
    })
}));

module.exports = passport;
