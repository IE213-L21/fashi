const express = require('express');
const router = express.Router();


const shopController = require('../app/controllers/ShopControllers');

router.get('/check-out', shopController.checkOut);
router.get('/product', shopController.product);
router.get('/shop', shopController.shop);
router.get('/shopping-cart', shopController.shoppingCart);


module.exports = router ;