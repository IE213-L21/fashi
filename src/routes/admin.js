const express = require('express');
const router = express.Router();


const adminController = require('../app/controllers/ProductController');

router.get('/create-product', adminController.createProduct)
router.get('/edit-product', adminController.editProduct)
//router.get('/me-product',productController.meProduct)
//router.get('/trash-product', productController.trashProduct)
//router.get('/cart',productController.cartProduct)

module.exports = router ;