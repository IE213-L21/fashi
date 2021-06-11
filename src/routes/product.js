const express = require('express');
const router = express.Router();

const productController = require('../app/controllers/ProductController');

router.get('/', productController.showAllProducts);
router.get('/check-out', productController.checkOut);
router.get('/product', productController.product);
router.get('/shopping-cart', productController.shoppingCart);
router.post('/search', productController.searchRealTime)
router.get('/search', productController.search);
router.get('/leagues/:league', productController.showLeague);
router.get('/clubs/:club', productController.showClub);


module.exports = router ;