const express = require('express');
const router = express.Router();

const passport = require('passport');

const commentsConrtoller = require('../controllers/comments_controller');

router.post('/create', passport.checkAuthentication, commentsConrtoller.createComment);
router.get('/destroy/:comment_id', passport.checkAuthentication, commentsConrtoller.destroy);

module.exports = router;