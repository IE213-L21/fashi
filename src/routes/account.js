const express = require('express');
const router = express.Router();
var passport = require('passport');

const accountController = require('../app/controllers/AccountController');

// for account/login
router.get('/login', accountController.login);
router.post('/login', passport.authenticate('local.login', {
    successRedirect: '/',
    failureRedirect: '/account/login',
    failureFlash: true
}));

// for account/register
router.get('/register', accountController.register)
router.post('/register', passport.authenticate('local.register', {
    successRedirect: '/account/login',
    failureRedirect: '/account/register',
    failureFlash: true
}));

// for log out
router.get('/logout', accountController.logout);

// for change password
router.get('/change-password', accountController.changePassword);
router.post('/change-password', accountController.sendChangePassword);

module.exports = router;