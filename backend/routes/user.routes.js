const express = require('express');
const router = express.Router();
const userControl = require('../controllers/users.controllers');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');


router.post('/signup', userControl.signup);
router.post('/login', userControl.login);
router.get('/profile', auth.getUser, userControl.getProfile);
router.put('/update-profile', auth.getUser, multer, userControl.updateProfile);
router.delete('/delete-profile', auth.getUser, userControl.deleteUser);
router.put('/update-password', auth.getUser, userControl.updatePassword);


module.exports = router;