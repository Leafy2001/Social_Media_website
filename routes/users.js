const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const path = require('path');

const usersConrtoller = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication,  usersConrtoller.profile);

router.get('/signin', usersConrtoller.signIn);
router.get('/signup', usersConrtoller.signUp);
router.get('/sign-out', usersConrtoller.signout);


router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate(
    'google', 
    {failureRedirect: '/users/signin'}
    ),
    usersConrtoller.createSession
);


// MULTER
const AVATAR_PATH = path.join('/uploads/users/avatars');
const __path = path.join(__dirname, '..', AVATAR_PATH);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __path);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});
const upload = multer({ storage: storage });
router.post('/update', passport.checkAuthentication,  upload.single('avatar'), usersConrtoller.update)
// MULTER END

router.post('/create', usersConrtoller.create);
router.post('/createSession', 
    passport.authenticate(
        'local',
        {failureRedirect: '/users/signin'}
    )
    ,usersConrtoller.createSession);

module.exports = router;