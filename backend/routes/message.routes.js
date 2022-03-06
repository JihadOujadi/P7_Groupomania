const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');



const messagesControl = require('../controllers/message.controller');

router.post('/new', auth.getUser, messagesControl.createMessage);
router.get('/', auth.getUser, messagesControl.getAllMessage);


module.exports = router;