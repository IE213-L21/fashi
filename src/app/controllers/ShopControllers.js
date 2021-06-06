const Product = require('../models/product')
const { multipleMongooseToObject } = require('../../util/mongoose')

class ShopController {

    // [GET] /
    checkOut(req, res) {
        res.render('shops/check-out');
    }
     
    // [GET] /
    product(req, res) {
        res.render('shops/product');
    }

    // [GET] /
    shop(req, res, next) {
        Product.find({})
        .then( (products) => {
            res.render('shops/shop', { products: multipleMongooseToObject(products) });
        })
        .catch(next);
    }
    
    // [GET] /
    shoppingCart(req, res) {
        res.render('shops/shopping-cart');
    }
     
    productDetails(req, res, next) {
        res.send('Arsenal');
    }
}

module.exports = new ShopController();
