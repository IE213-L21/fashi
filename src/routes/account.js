const express = require('express');
const router = express.Router();
var passport = require('passport');



const accountController = require('../app/controllers/AccountController');


router.get('/login', accountController.login);
router.post('/login', passport.authenticate('local.login', {
    successRedirect: '/',
    failureRedirect: '/account/login',
    failureFlash: true
}));
router.get('/register', accountController.register)
router.post('/register', passport.authenticate('local.register', {
    successRedirect: '/account/login',
    failureRedirect: '/account/register',
    failureFlash: true
}));
router.get('/logout', accountController.logout);

// Change password
router.get('/setting', accountController.setting);
router.post('/setting', accountController.changePassword);

module.exports = router;