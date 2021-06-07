const express = require('express');
const router = express.Router();

const productController = require('../app/controllers/ProductController');

router.get('/check-out', productController.checkOut);
router.get('/product', productController.product);
router.get('/shop', productController.shop);
router.get('/shopping-cart', productController.shoppingCart);
router.get('/:slug', productController.productDetails);


module.exports = router ;