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
            let numberOfProduct = products.length;
            res.render('product/shop', {
                products: multipleMongooseToObject(products),
                numberOfProduct: numberOfProduct
            });
        })
        .catch(next);
    }

    search(req, res,next) {
        Product.find({name:req.query.name})
        .then( (products) => {
            res.render('product/search', { products: multipleMongooseToObject(products) });
        })
        .catch(next);
    }

    searchRealTime(req, res, next){
        //Declare variables
        let hint = "";
        let response = "";
        let searchQ = req.body.search.toLowerCase(); 
        let filterNum = 1;

        if(searchQ.length > 0){
            Product.find(function(err, results){
            if(err){
                console.log(err);
            }else{
                results.forEach(function(sResult){
                    if(sResult.name.toLowerCase().indexOf(searchQ) !== -1){
                        if(hint === ""){
                            hint="<a href='/product/" + sResult.slug + "' target='_self'>" + sResult.name + "</a>";
                        }else if(filterNum < 20){
                            hint = hint + "<br /><a href='/product/" + sResult.slug + "' target='_self'>" + sResult.name + "</a>";
                            filterNum++;
                        }
                    }
                })
            }
            if(hint === ""){
                response = "no suggestion"
            }else{
                response = hint;
            }
        
            res.send({response: response});
        });
        }
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
