const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');




const postsControl = require('../controllers/post.controller');

router.post('/new', auth.getUser, multer, postsControl.createPost);
router.get('/', multer, postsControl.getAllPost);
router.put('/:id', auth.getUser, multer, postsControl.modifyPost);
router.delete('/:id', auth.getUser, multer, postsControl.deletePost);
router.post('/comment/:id', auth.getUser, postsControl.addComment);


module.exports = router;