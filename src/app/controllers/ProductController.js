const Product = require('../models/product')
const { multipleMongooseToObject } = require('../../util/mongoose')
const { mongooseToObject } = require('../../util/mongoose')

class ProductController {

    // [GET] /
    checkOut(req, res) {
        res.render('product/check-out');
    }
     
    // [GET] /
    product(req, res) {
        res.render('product/product');
    }

    // [GET] /
    shop(req, res, next) {
        Product.find({})
        .then( (products) => {
            res.render('product/shop', { products: multipleMongooseToObject(products) });
        })
        .catch(next);
    }
    
    // [GET] /
    shoppingCart(req, res) {
        res.render('product/shopping-cart');
    }
    
    // [GET] /
    productDetails(req, res, next) {
        Product.findOne( {slug: req.params.slug} )
        .then( (product) => {
            res.render('product/product-detail', {
                product: mongooseToObject(product)
            });
        })
        .catch(next);
    }
}

module.exports = new ProductController();
