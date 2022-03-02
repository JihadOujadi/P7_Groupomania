const express = require('express');
const router = express.Router();
const userControl = require('../controllers/users.controllers');
const auth = require('../middlewares/auth');


router.post('/signup', userControl.signup);
router.post('/login', userControl.login);
router.get('/profile', userControl.getProfile);


module.exports = router;