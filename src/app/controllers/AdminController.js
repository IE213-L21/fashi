const Product = require('../models/product');
const { mongooseToObject } = require('../../util/mongoose')
const {multipleMongooseToObject} = require('../../util/mongoose')


class AdminController {

    // Trang admin
    adminHome(req, res, next) {
        Product.find({})
            .then((products) => {
                res.render('admin/index',{layout: 'admin',products: multipleMongooseToObject(products)})
            })
            .catch(next)
    }

    // Render page create product
    createProduct(req, res) {
        res.render('admin/create-product')
    }

    // Save data from page create-product
    sendCreateProduct(req, res, next) {
        const data = req.body
        data.image =req.file.filename
        const product = new Product(data)
        product.save()
            .then(() => res.redirect('/admin/products'))
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
     updateProduct(req, res) {
        const data = req.body
        if (req.file) {
            data.image = req.file.filename
        }  
        Product.updateOne({ _id: req.params.id}, data)
            .then(() => {
                res.redirect('/admin')
            })
    }

    // Render trash admin page
    trashProduct(req, res, next){
        res.render('admin/trash-product');
    }
}

module.exports = new AdminController;
