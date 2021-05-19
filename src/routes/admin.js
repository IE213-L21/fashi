const express = require('express');
const router = express.Router();


const adminController = require('../app/controllers/AdminController');

router.get('/create-product', adminController.createProduct)
router.post('/create-product', adminController.sendCreateProduct)

router.get('/edit-product', adminController.editProduct)
router.get('/index',adminController.adminHome)
//router.get('/trash-product', productController.trashProduct)
//router.get('/cart',productController.cartProduct)

module.exports = router ;