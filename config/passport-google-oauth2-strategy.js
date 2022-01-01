const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new googleStrategy({
    clientID: "598741569104-0n0fjkt10fp69sqdhfpve210a6rmhfdb.apps.googleusercontent.com",
    clientSecret: "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",
    // callbackURL: "http://localhost:8000/users/auth/google/callback"
    callbackURL: "https://meme-coding.herokuapp.com/users/auth/google/callback"
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
