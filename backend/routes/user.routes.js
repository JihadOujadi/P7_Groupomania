const express = require('express');
const router = express.Router();
const userControl = require('../controllers/users.controllers');


router.post('/signup', userControl.signup);
router.post('/login', userControl.login);


module.exports = router;