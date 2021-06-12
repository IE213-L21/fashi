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
    async showAllProducts(req, res, next) {
        try {
            const leagues = await League.find({});
            const clubs = await Club.find({});
            const totalProducts = await Product.find({});
            const productsPerPage = 4;
            const page = req.query.page || 1;
            const begin = (page - 1) * productsPerPage;
            const totalPage = Math.ceil(totalProducts.length / productsPerPage);
            const products = await Product
                .find({ deleted: "false" })
                .skip(begin)
                .limit(productsPerPage);
            res.render('product/shop', {
                products: multipleMongooseToObject(products),
                leagues: multipleMongooseToObject(leagues),
                clubs: multipleMongooseToObject(clubs),
                totalPage: totalPage,
                page: page,
            });
        } catch(err){
            if (err)
                next(err);
        }
    }

    // [GET] /admin/product-api
    showAPIProducts(req, res, next) {
        Product.find({ deleted: "false" })
        .then( (products) => {
            res.json(products);
        })
        .catch(next);
    }

    search(req, res, next) {
        const keyword = req.query.name;
        Promise.all([Product.find({ deleted: "false" }), League.find({}), Club.find({})])
            .then(([products, leagues, clubs]) => {
                products = products.filter((product) => {
                    return product.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
                })
                res.render('product/search', {
                    products: multipleMongooseToObject(products),
                    leagues: multipleMongooseToObject(leagues),
                    clubs: multipleMongooseToObject(clubs),
                });
            })
            .catch(next);
    }

    searchRealTime(req, res, next) {
        let hint = "";
        let response = "";
        let searchQ = req.body.search.toLowerCase();
        let filterNum = 1;

        if (searchQ.length > 0) {
            Product.find(function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    results.forEach(function (sResult) {
                        if (sResult.name.toLowerCase().indexOf(searchQ) !== -1) {
                            if (hint === "") {
                                hint = "<a href='/product/" + sResult.slug + "' target='_self'>" + sResult.name + "</a>";
                            } else if (filterNum < 20) {
                                hint = hint + "<br /><a href='/product/" + sResult.slug + "' target='_self'>" + sResult.name + "</a>";
                                filterNum++;
                            }
                        }
                    })
                }
                if (hint === "") {
                    response = "No product matched"
                } else {
                    response = hint;
                }
                res.send({ response: response });
            });
        }
    }

    // [GET] /
    shoppingCart(req, res) {
        res.render('product/shopping-cart');
    }

    // [GET] /
    productDetail(req, res, next) {
        Product.findOne({ slug: req.params.slug })
            .then((product) => {
                res.render('product/product-detail', {
                    product: mongooseToObject(product)
                });
            })
            .catch(next);
    }

    // [GET] product/leagues/:league
    async showLeague(req, res) {
        const clubs = await Club.find({});
        const leagues = await League.find({});
        const leagueNeededRender = await League.findOne({ slug: req.params.league })
        const products = await Product.find({ league: leagueNeededRender.name });
        res.render('product/shop', {
            products: multipleMongooseToObject(products),
            leagues: multipleMongooseToObject(leagues),
            clubs: multipleMongooseToObject(clubs)
        })
    }

    // [GET] product/clubs/:club
    async showClub(req, res) {
        const clubs = await Club.find({});
        const leagues = await League.find({});
        const clubFound = await Club.findOne({ slug: req.params.club })
        const products = await Product.find({ club: clubFound.name });
        res.render('product/shop', {
            products: multipleMongooseToObject(products),
            leagues: multipleMongooseToObject(leagues),
            clubs: multipleMongooseToObject(clubs)
        })
    }

    // [GET] /product/add-to-cart/:id
    addProductToCart(req, res, next) {
        Product.findOne({ _id: req.params.id })
            .then((product) => {
                res.send('Arsenal');
            })
            .catch(next);
    }
}

module.exports = new ProductController();
