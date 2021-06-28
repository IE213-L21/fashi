const Product = require('../models/product')
const League = require('../models/league')
const Club = require('../models/club')
const User = require('../models/user');
const Session = require('../models/sessionID')
const { multipleMongooseToObject } = require('../../util/mongoose')
const { mongooseToObject } = require('../../util/mongoose')

class ProductController {

    async checkOut(req, res) {
        if(req.isAuthenticated()){
            const user = await User.find({'info.firstname':req.session.User.name})
            const username = user.map(user=>user=user.toObject())
            const role = username[0].role==='admin' ? 'admin' : ''
            const email = username[0].local.email;
            try {
                const sessionID = req.signedCookies.sessionId;
                let session = await Session.findOne({ sessionId: sessionID });
                let totalProductsInCart = 0;
                let productsInCart = [];
                let totalPriceInCart = 0;
                if (session) {
                    totalProductsInCart = session.totalProducts;
                    for (let [key, value] of session.cart.entries()) {
                        let productInCart = await Product.findOne({ _id: key }).lean();
                        let totalPriceEachProductInCart = productInCart.price * value;
                        Object.assign(productInCart, { quantityInCart: value }, { totalPrice: totalPriceEachProductInCart });
                        totalPriceInCart += totalPriceEachProductInCart;
                        productsInCart.push(productInCart);
                    }
                }
                else
                    session = {};
                res.render('product/check-out', {
                    productsInCart: productsInCart,
                    totalProductsInCart: totalProductsInCart,
                    totalPriceInCart: totalPriceInCart,
                    session: mongooseToObject(session),
                    user: username[0].info,
                    role,
                    email
                });
            } catch(err) {
                if (err)
                    console.log(err);
                next(err);
            };
        }
        else {
            try {
                const sessionID = req.signedCookies.sessionId;
                let session = await Session.findOne({ sessionId: sessionID });
                let totalProductsInCart = 0;
                let productsInCart = [];
                let totalPriceInCart = 0;
                if (session) {
                    totalProductsInCart = session.totalProducts;
                    for (let [key, value] of session.cart.entries()) {
                        let productInCart = await Product.findOne({ _id: key }).lean();
                        let totalPriceEachProductInCart = productInCart.price * value;
                        Object.assign(productInCart, { quantityInCart: value }, { totalPrice: totalPriceEachProductInCart });
                        totalPriceInCart += totalPriceEachProductInCart;
                        productsInCart.push(productInCart);
                    }
                }
                else
                    session = {};
                res.render('product/check-out', {
                    productsInCart: productsInCart,
                    totalProductsInCart: totalProductsInCart,
                    totalPriceInCart: totalPriceInCart,
                    session: mongooseToObject(session),
                });
            } catch(err) {
                if (err)
                    console.log(err);
                next(err);
            };
        }
    }

    // [GET] /
    product(req, res) {
        res.render('product/product');
    }

    // [GET] /
    async showAllProducts(req, res, next) {
        if(req.isAuthenticated()){
            const user = await User.find({'info.firstname':req.session.User.name})
            const username = user.map(user=>user=user.toObject())
            const role = username[0].role==='admin' ? 'admin' : ''
            try {
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
                    role: role,
                    user: username[0].info,
                });
            } catch (err) {
                if (err)
                    next(err);
            }
        }
        else{
            try {
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
                });
            } catch (err) {
                if (err)
                    next(err);
            }
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
    async shoppingCart(req, res) {
        try {
            const sessionID = req.signedCookies.sessionId;
            res.render('product/shopping-cart', {
                productsInCart: res.locals.productsInCart,
                totalPriceInCart: res.locals.totalPriceInCart,
                session: res.locals.session
            });
        } catch(err) {
            if (err)
                console.log(err);
            next(err);
        };
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
            .then((session) => {
                let count = session.cart.get(productID);
                session.cart.delete(productID);
                session.totalProducts -= count;
                session.save((err) => {
                    if (err)
                        console.log(err);
                    res.redirect('back');
                })
            })
            .catch(next);
    }

    // [POST]
    async updateCartInCartDetail(req, res, next) {
        let input = req.body;
        let productId = req.params.productId;
        let error;

        // validation input
        let product = await Product.findOne({ _id: productId });
        if (input.currentSize == 'S' && product.quantityOfSizeS < input.numberOfProduct){
            error = 'Number of product is over in stock'
            input.numberOfProduct = product.quantityOfSizeS;
        }
        if (input.currentSize == 'M' && product.quantityOfSizeM < input.numberOfProduct){
            error = 'Number of product is over in stock'
            input.numberOfProduct = product.quantityOfSizeM;
        }
        if (input.currentSize == 'L' && product.quantityOfSizeL < input.numberOfProduct){
            error = 'Number of product is over in stock'
            input.numberOfProduct = product.quantityOfSizeL;
        }

        let sessionId = req.signedCookies.sessionId;
        let session = await  Session.findOne({ sessionId: sessionId });
        let numberOfProductBeforeUpdate = session.cart.get(productId);
        session.cart.set(productId, input.numberOfProduct);
        session.totalProducts += parseInt(input.numberOfProduct) - parseInt(numberOfProductBeforeUpdate);

        // set total price in cart
        let totalPriceInCart = 0;
        for (let [key, value] of session.cart.entries()) {
            let productInCart = await Product.findOne({ _id: key })
            let totalPriceEachProductInCart = productInCart.price * value;
            totalPriceInCart += totalPriceEachProductInCart;
        };

        // set price of this product
        let priceOfProduct = product.price * parseInt(input.numberOfProduct);

        await session.save();
        return res.json({
            session,
            totalPriceInCart,
            priceOfProduct,
            error,
            numberOfProduct: input.numberOfProduct,
        });
    }
}

module.exports = new ProductController();
