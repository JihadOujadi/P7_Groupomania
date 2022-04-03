const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');




const postsControl = require('../controllers/post.controller');

router.post('/new', auth.getUser, multer, postsControl.createPost);
router.get('/', multer, postsControl.getAllPost);
router.get('/:id', auth.getUser, postsControl.getOnePost);
router.put('/:id', auth.getUser, multer, postsControl.modifyPost);
router.delete('/:id', auth.getUser, multer, postsControl.deletePost);
router.post('/:id/comment', auth.getUser, postsControl.addComment);
router.get('/:id/comment', postsControl.getComment);
router.delete('/:id/comment/:id', auth.getUser, postsControl.deleteComment);
router.post('/:id/like', auth.getUser, postsControl.likePost);


module.exports = router;