const express = require('express');
const router = express.Router();
const userControl = require('../controllers/users.controllers');
const auth = require('../middlewares/auth');


router.post('/signup', userControl.signup);
router.post('/login', userControl.login);
router.get('/profile', auth.getUser, userControl.getProfile);
router.put('/update-profile', userControl.updateProfile);
router.delete('/profile', userControl.deleteUser);


module.exports = router;