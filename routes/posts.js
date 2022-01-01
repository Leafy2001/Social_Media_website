const express = require('express');
const router = express.Router();

const path = require('path');
const passport = require('passport');

const usersConrtoller = require('../controllers/users_controller');
const postsController = require('../controllers/posts_controller');


// MULTER POST IMAGE CONFIGURATION
const multer = require('multer');

const POST_PATH = '/uploads/users/posts';
const __path_post = path.join(__dirname, '..', POST_PATH);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __path_post);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

const fileFilter = (req, file, cb) => {
      if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
          cb(null, true);
      }else{
        cb({
          message: "Unsupported File Format"
        }, false);
      }
}

const upload = multer(
  {
    storage: storage,
    limits: {fileSize: 1024*1024},
    fileFilter: fileFilter
  }
);
router.post('/create', passport.checkAuthentication, upload.single('post_pic'), postsController.create);
// ***********************************

router.get('/destroy/:post_id', passport.checkAuthentication, postsController.destroy);


module.exports = router;