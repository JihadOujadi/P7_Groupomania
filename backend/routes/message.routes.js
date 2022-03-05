const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');


const messagesControl = require('../controllers/message.controller');

router.post('/new', messagesControl.createMessage);
router.get('/', messagesControl.getAllMessage);


module.exports = router;