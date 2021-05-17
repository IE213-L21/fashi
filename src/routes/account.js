const express = require('express');
const router = express.Router();



const accountController = require('../app/controllers/AccountController');

router.get('/login', accountController.login);
router.get('/register', accountController.register);


module.exports = router ;