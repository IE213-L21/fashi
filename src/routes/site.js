const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

router.get('/contact', siteController.contact);
router.get('/main', siteController.main);
router.get('/', siteController.index);

module.exports = router ;