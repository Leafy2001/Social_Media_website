const express = require('express');
const router = express.Router();

// MULTER POST IMAGE CONFIGURATION
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/users/posts');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

const upload = multer({storage: storage});
// ***********************************

const passport = require('passport');

const usersConrtoller = require('../controllers/users_controller');
const postsController = require('../controllers/posts_controller');

router.post('/create', passport.checkAuthentication, upload.single('post_pic'), postsController.create);
router.get('/destroy/:post_id', passport.checkAuthentication, postsController.destroy);


module.exports = router;