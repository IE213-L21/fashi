const express = require('express');
const router = express.Router();


const adminController = require('../app/controllers/AdminController');

router.get('/create-product', adminController.createProduct)
router.post('/create-product', adminController.sendCreateProduct)

router.get('/edit-product', adminController.editProduct)

router.get('/products', adminController.adminHome)
router.get('/trash-product', adminController.trashProduct)
//router.get('/cart', adminController.cartProduct)

module.exports = router ;