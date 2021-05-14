var express = require('express')
var router = express.Router()

const productController = require('../controllers/productControllers')

router.get('/',productController.index)
router.get('/product/:id',productController.product)
router.get('/blog',productController.blog)
router.get('/blog_details',productController.blog_details)
router.get('/check_out',productController.check_out)
router.get('/contact',productController.contact)
router.get('/faq',productController.faq)
router.get('/login',productController.login)
router.get('/register',productController.register)
router.get('/shop',productController.shop)
router.get('/shopping_cart',productController.shopping_cart)

module.exports = router 