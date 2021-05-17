const express = require('express');
const router = express.Router();


const blogController = require('../app/controllers/BlogController');

router.get('/blog-details', blogController.blogDetail);
router.get('/blog', blogController.blog);
router.get('/faq', blogController.faq);


module.exports = router ;