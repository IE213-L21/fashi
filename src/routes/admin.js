const express = require('express');
const router = express.Router();
const multer  = require('multer')


const adminController = require('../app/controllers/AdminController');
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./src/public/img/create-img')
    },
    filename:function(req,file,cb){
        cb(null, file.originalname)
    }
})

const uploads = multer( { storage:storage } );

router.get('/create-product', adminController.createProduct)
router.post('/create-product', uploads.single('image'), adminController.sendCreateProduct)

router.get('/create-league', adminController.createLeague)
router.post('/create-league', adminController.saveCreateLeague)

router.get('/create-club', adminController.createClub)
router.post('/create-club', adminController.saveCreateClub)

router.get('/:id/edit-product', uploads.single('image'), adminController.editProduct)
router.put('/update/:id', uploads.single('image'), adminController.updateProduct)

router.get('/bill', adminController.bill)

router.get('/', adminController.adminHome)
router.get('/trash-product', adminController.trashProduct)
router.delete('/trash-product/:id/force',adminController.deleteForever)
router.patch('/trash-product/:id/restore',adminController.restoreProduct)

router.delete('/:id',adminController.deleteSoftProduct)

router.post('/handle-form-actions', adminController.handleFormActions);

//router.get('/cart', adminController.cartProduct)

module.exports = router ;