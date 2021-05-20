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
    editProduct(req, res) {
        res.render('admin/edit-product')
    }

    // Render trash admin page
    trashProduct(req, res, next){
        res.render('admin/trash-product');
    }
}

module.exports = new AdminController;
