// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authentication-controller');

router.post('/login', authController.login);
// router.post('/signup', authController.signup); // add if needed

router.post('/createUser', authController.createUser)

module.exports = router;
