const express = require('express');
const router = express.Router();
const userControl = require('../controllers/users.controllers');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const user = require('../models/user');


router.post('/signup', userControl.signup);
router.post('/login', userControl.login);
router.get('/profile', auth.getUser, userControl.getProfile);
router.get('/profile/messages', auth.getUser, userControl.getUserMessage)
router.put('/update-profile', auth.getUser, userControl.updateProfile);
router.delete('/delete-profile', auth.getUser, userControl.deleteUser);
router.post('/upload', auth.getUser, multer, userControl.uploadImage);


module.exports = router;