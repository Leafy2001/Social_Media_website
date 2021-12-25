const express = require('express');
const router = express.Router();

const passport = require('passport');

const usersConrtoller = require('../controllers/users_controller');
const postsController = require('../controllers/posts_controller');

router.post('/create', passport.checkAuthentication ,postsController.create);
router.get('/destroy/:post_id', passport.checkAuthentication, postsController.destroy);


module.exports = router;