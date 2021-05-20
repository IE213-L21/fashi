const express = require('express');
const router = express.Router();
const multer  = require('multer')


const adminController = require('../app/controllers/AdminController');
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./src/public/img/create-img')
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})

const uploads = multer({storage:storage})

router.get('/create-product', adminController.createProduct)
router.post('/create-product',uploads.single('image'), adminController.sendCreateProduct)

router.get('/edit-product', adminController.editProduct)

router.get('/', adminController.adminHome)
router.get('/trash-product', adminController.trashProduct)
//router.get('/cart', adminController.cartProduct)

module.exports = router ;