const express = require('express');

const router = express.Router();

const authController = require('../controller/auth');

// GET
router.get('/register', authController.getSignUp);
router.get('/login', authController.getSignIn);

//POST
router.post('/sign-up', authController.postSignUp);
router.post('/logout', authController.postLogout);
router.post('/sign-in', authController.postSignIn);




module.exports = router;