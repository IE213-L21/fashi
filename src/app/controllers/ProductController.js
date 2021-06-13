const Product = require('../models/product')
const League = require('../models/league')
const Club = require('../models/club')
const Session = require('../models/sessionID')
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
            const sessionID = req.signedCookies.sessionId;
            let session = await Session.findOne({ sessionId: sessionID });
            let totalProducts = 0;
            let productsInCart = [];
            let totalPriceInCart = 0;
            if (session) {
                totalProducts = session.totalProducts;
                for (let [key, value] of session.cart.entries()) {
                    let productInCart = await Product.findOne({ _id: key }).lean();
                    Object.assign(productInCart, { quantityInCart: value });
                    totalPriceInCart += productInCart.price * value;
                    productsInCart.push(productInCart);
                }
            }
            else
                session = {};
            const leagues = await League.find({});
            const clubs = await Club.find({});

            const numberOfProducts = await Product.countDocuments({});
            const productsPerPage = 6;
            const page = req.query.page || 1;
            const begin = (page - 1) * productsPerPage;
            const totalPage = Math.ceil(numberOfProducts / productsPerPage);
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
                productsInCart: productsInCart,
                totalProducts: totalProducts,
                totalPriceInCart: totalPriceInCart,
                session: mongooseToObject(session),
            });
        } catch (err) {
            if (err)
                next(err);
        }
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
    async showLeague(req, res, next) {
        const clubs = await Club.find({});
        const leagues = await League.find({});
        const leagueNeededRender = await League.findOne({ slug: req.params.league });
        const numberOfProducts = await Product.countDocuments({ league: leagueNeededRender.name });
        const productsPerPage = 6;
        const page = req.query.page || 1;
        const begin = (page - 1) * productsPerPage;
        const totalPage = Math.ceil(numberOfProducts / productsPerPage);
        const products = await Product
            .find({ league: leagueNeededRender.name })
            .skip(begin)
            .limit(productsPerPage);
        res.render('product/shop', {
            products: multipleMongooseToObject(products),
            leagues: multipleMongooseToObject(leagues),
            clubs: multipleMongooseToObject(clubs),
            totalPage: totalPage,
            page: page,
        })
    }

    // [GET] product/clubs/:club
    async showClub(req, res) {
        const clubs = await Club.find({});
        const leagues = await League.find({});
        const clubFound = await Club.findOne({ slug: req.params.club });
        const numberOfProducts = await Product.countDocuments({ club: clubFound.name });
        const productsPerPage = 6;
        const page = req.query.page || 1;
        const begin = (page - 1) * productsPerPage;
        const totalPage = Math.ceil(numberOfProducts / productsPerPage);
        const products = await Product
            .find({ club: clubFound.name })
            .skip(begin)
            .limit(productsPerPage);
        res.render('product/shop', {
            products: multipleMongooseToObject(products),
            leagues: multipleMongooseToObject(leagues),
            clubs: multipleMongooseToObject(clubs),
            totalPage: totalPage,
            page: page,
        })
    }

    // [GET] /product/add-to-cart/:id
    addProductToCart(req, res, next) {
        let productID = req.params.id;
        let sessionID = req.signedCookies.sessionId;
        Session.findOne({ sessionId: sessionID })
            .then((session) => {
                let count = session.cart.get(productID) || 0;
                session.cart.set(productID, count + 1);
                session.totalProducts++;
                session.save((err) => {
                    if (err)
                        console.log(err);
                    res.redirect('back');
                })
            })
            .catch(next);
    }

    // [GET] /product/remove-from-cart/:id
    removeProductFromCart(req, res, next) {
        let productID = req.params.id;
        let sessionID = req.signedCookies.sessionId;
        Session.findOne({ sessionId: sessionID })
        .then( (session) => {
            let count = session.cart.get(productID);
            if (count == 1) {
                session.cart.delete(productID);
            }
            else
                session.cart.set(productID, count - 1);
            session.totalProducts--;
            session.save((err) => {
                if (err)
                    console.log(err);
                res.redirect('back');
            })
        })
        .catch(next);
    }
}

module.exports = new ProductController();
