const Product = require('../models/product');
const { mongooseToObject } = require('../../util/mongoose')
const {multipleMongooseToObject} = require('../../util/mongoose')


class AdminController {


  
    // Trang admin
    adminHome(req, res, next) {

        Promise.all([Product.find({}).sortable(req), Product.countDocumentsDeleted()])
            .then(([products,deletedCount]) =>   
                 res.render('admin/index',{layout: 'admin',products: multipleMongooseToObject(products),deletedCount }),
            )
            .catch(next)
    }

    // Render page create product
    createProduct(req, res) {
        res.render('admin/create-product', {layout: 'admin'})
    }

    // Save data from page create-product
    sendCreateProduct(req, res, next) {
        const data = req.body
        data.image =req.file.filename
        const product = new Product(data)
        product.save()
            .then(() => res.redirect('/admin'))
            .catch(next)
    }

    
    // Render page edit product
    editProduct(req, res, next) {
        Product.findById({_id:req.params.id})
            .then(products => res.render('admin/edit-product', {
                layout: 'admin',
                products: mongooseToObject(products)
            })) 
            .catch(next)
    }

    //Update Product from form edit product
     updateProduct(req, res,next) {
        const data = req.body
        if (req.file) {
            data.image = req.file.filename
        }  
        Product.updateOne({ _id: req.params.id}, data)
            .then(() => {
                res.redirect('/admin')
            })
            .catch(next)
    }

    // Delete soft product
    deleteSoftProduct(req,res,next) {
        Product.delete({ _id: req.params.id})
        .then(() => res.redirect('back'))
        .catch(next);
    }

    //Trash product
    trashProduct(req,res,next) {
        Product.findDeleted({})
            .then(products => res.render('admin/trash-product',{layout: 'admin',products:multipleMongooseToObject(products)}))
            .catch(next);
    }

    //restorer
    restoreProduct(req,res,next) {
        Product.restore({ _id: req.params.id})
            .then(()=>res.redirect('back'))
            .catch(next)
    }

    //Delete forever
    deleteForever(req, res, next){
        Product.deleteOne({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next)
    }

    //[POST] /admin/handle-form-actions
    handleFormActions(req, res, next) {
        switch(req.body.action) {
            case 'delete':
                Product.delete({ _id: { $in: req.body.productIds} } )
                .then(() => res.redirect('back'))
                .catch(next);
                
                break;
            default: 
                res.json({message: 'Action invalid!'});
        }
    }

}

module.exports = new AdminController;
