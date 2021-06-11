const Product = require('../models/product')
const League = require('../models/league')
const Club = require('../models/club')
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
    async showAllProducts(req, res) {
        const products = await Product.find({});
        const leagues = await League.find({});
        const clubs = await Club.find({})
        let numberOfProduct = products.length;
        res.render('product/shop', {
                products: multipleMongooseToObject(products),
                numberOfProduct: numberOfProduct,
                leagues: multipleMongooseToObject(leagues),
                clubs: multipleMongooseToObject(clubs)
        });
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

    // [GET] /leagues/:league
    async showLeague(req, res){
        const clubs = await Club.find({});
        const leagues = await League.find({});
        const leagueNeededRender = await League.findOne({ slug: req.params.league})
        const products = await Product.find({ league: leagueNeededRender.name });
        res.render('product/shop', {
            products: multipleMongooseToObject(products),
            leagues: multipleMongooseToObject(leagues),
            clubs: multipleMongooseToObject(clubs)
        })
    }

    // [GET] /clubs/:club
    async showClub(req, res){
        const clubs = await Club.find({});
        const leagues = await League.find({});
        const clubFound = await Club.findOne({ slug: req.params.club})
        const products = await Product.find({ club: clubFound.name });
        res.render('product/shop', {
            products: multipleMongooseToObject(products),
            leagues: multipleMongooseToObject(leagues),
            clubs: multipleMongooseToObject(clubs)
        })
    }
}

module.exports = new ProductController();
