const express = require('express');
const router = express.Router();


const productController = require('../app/controllers/ProductController');

router.get('/create-product', productController.createProduct)
router.get('/edit-product', productController.editProduct)
//router.get('/me-product',productController.meProduct)
//router.get('/trash-product', productController.trashProduct)
//router.get('/cart',productController.cartProduct)

module.exports = router ;