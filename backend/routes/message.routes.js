const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const messagesControl = require('../controllers/message.controller');

router.post('/', auth, multer, messagesControl.createMessage);
router.put('/:id', auth, multer, messagesControl.modifyMessage);
router.delete('/:id', auth, messagesControl.deleteMessage);
router.get('/', auth, messagesControl.getAllMessage);
router.get('/:id', auth, messagesControl.getOneMessage);
router.post('/:id/like', auth, messagesControl.likeMessage);


module.exports = router;