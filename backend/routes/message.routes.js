const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');



const messagesControl = require('../controllers/message.controller');

router.post('/new', auth.getUser, multer, messagesControl.createMessage);
router.get('/', auth.getUser, multer, messagesControl.getAllMessage);


module.exports = router;