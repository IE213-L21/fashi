const express = require('express');
const router = express.Router();

const productController = require('../app/controllers/ProductController');

router.get('/', productController.showAllProducts);
router.post('/check-out/confirm', productController.confirmCheckout);
router.get('/check-out', productController.checkOut);   
router.get('/shopping-cart/:sessionID', productController.shoppingCart);
router.post('/search', productController.searchRealTime)
router.get('/search', productController.search);
router.get('/leagues/:league', productController.showLeague);
router.get('/clubs/:club', productController.showClub);
router.get('/add-to-cart/:id', productController.addProductToCart);
router.get('/remove-from-cart/:id', productController.removeProductFromCart);
router.post('/update-cart/:productId', productController.updateCartInCartDetail);
router.get('/:slug', productController.productDetail);

module.exports = router ;