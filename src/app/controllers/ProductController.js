const Product = require('../models/product')
const League = require('../models/league')
const Club = require('../models/club')
const User = require('../models/user');
const Session = require('../models/sessionID');
const Checkout = require('../models/checkout');
const sendEmail = require('./EmailController')
const { multipleMongooseToObject } = require('../../util/mongoose')
const { mongooseToObject } = require('../../util/mongoose')

class ProductController {

    async checkOut(req, res) {
        if (req.isAuthenticated()) {
            const user = await User.find({ 'info.firstname': req.session.User.name })
            const username = user.map(user => user = user.toObject())
            const role = username[0].role === 'admin' ? 'admin' : ''
            const email = username[0].local.email;
            try {
                res.render('product/check-out', {
                    productsInCart: res.locals.productsInCart,
                    totalProductsInCart: res.locals.totalProductsInCart,
                    totalPriceInCart: res.locals.totalPriceInCart,
                    session: res.locals.session,
                    user: username[0].info,
                    role,
                    email
                });
            } catch (err) {
                if (err)
                    console.log(err);
                next(err);
            };
        }
        else {
            try {
                res.render('product/check-out', {
                    productsInCart: res.locals.productsInCart,
                    totalProductsInCart: res.locals.totalProductsInCart,
                    totalPriceInCart: res.locals.totalPriceInCart,
                    session: res.locals.session,
                });
            } catch (err) {
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
        if (req.isAuthenticated()) {
            const user = await User.find({ 'info.firstname': req.session.User.name })
            const username = user.map(user => user = user.toObject())
            const role = username[0].role === 'admin' ? 'admin' : ''
            try {
                const leagues = await League.find({});
                const clubs = await Club.find({});

                const numberOfProducts = await Product.countDocuments({});
                const productsPerPage = 6;
                const page = req.query.page || 1;
                const begin = (page - 1) * productsPerPage;
                const totalPage = Math.ceil(numberOfProducts / productsPerPage);
                if (req.query.hasOwnProperty('_sort')) {
                    var products = await Product
                    .find({ deleted: 'false', $or: [
                        { quantityOfSizeS: { $gt: 0 } },
                        { quantityOfSizeM: { $gt: 0 } },
                        { quantityOfSizeL: { $gt: 0 } },
                    ]})
                        .sort({ 'price': req.query.type == 'asc' ? 1 : -1 })
                        .skip(begin)
                        .limit(productsPerPage);
                } else {
                    var products = await Product
                    .find({ deleted: 'false', $or: [
                        { quantityOfSizeS: { $gt: 0 } },
                        { quantityOfSizeM: { $gt: 0 } },
                        { quantityOfSizeL: { $gt: 0 } },
                    ]})
                        .skip(begin)
                        .limit(productsPerPage);
                }
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
        else {
            try {
                const leagues = await League.find({});
                const clubs = await Club.find({});

                const numberOfProducts = await Product.countDocuments({});
                const productsPerPage = 6;
                const page = req.query.page || 1;
                const begin = (page - 1) * productsPerPage;
                const totalPage = Math.ceil(numberOfProducts / productsPerPage);
                if (req.query.hasOwnProperty('_sort')) {
                    var products = await Product
                    .find({ deleted: 'false', $or: [
                        { quantityOfSizeS: { $gt: 0 } },
                        { quantityOfSizeM: { $gt: 0 } },
                        { quantityOfSizeL: { $gt: 0 } },
                    ]})
                        .sort({ 'price': req.query.type == 'asc' ? 1 : -1 })
                        .skip(begin)
                        .limit(productsPerPage);
                } else {
                    var products = await Product
                    .find({ deleted: 'false', $or: [
                        { quantityOfSizeS: { $gt: 0 } },
                        { quantityOfSizeM: { $gt: 0 } },
                        { quantityOfSizeL: { $gt: 0 } },
                    ]})
                        .skip(begin)
                        .limit(productsPerPage);
                }
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

    async search(req, res, next) {
        if (req.isAuthenticated()) {
            var user = await User.find({ 'info.firstname': req.session.User.name })
            var username = user.map(user => user = user.toObject())
            var role = username[0].role === 'admin' ? 'admin' : ''
        }
        const keyword = req.query.name;
        Promise.all([Product.find({ deleted: 'false', $or: [
            { quantityOfSizeS: { $gt: 0 } },
            { quantityOfSizeM: { $gt: 0 } },
            { quantityOfSizeL: { $gt: 0 } },
        ]}), League.find({}), Club.find({})])
            .then(([products, leagues, clubs]) => {
                products = products.filter((product) => {
                    return product.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
                })
                res.render('product/search', {
                    products: multipleMongooseToObject(products),
                    leagues: multipleMongooseToObject(leagues),
                    clubs: multipleMongooseToObject(clubs),
                    role: role,
                    user: req.isAuthenticated() ? username[0].info : '',
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
    async shoppingCart(req, res, next) {
        if (req.isAuthenticated()) {
            var user = await User.find({ 'info.firstname': req.session.User.name })
            var username = user.map(user => user = user.toObject())
            var role = username[0].role === 'admin' ? 'admin' : ''
        }
        try {
            res.render('product/shopping-cart', {
                productsInCart: res.locals.productsInCart,
                totalPriceInCart: res.locals.totalPriceInCart,
                session: res.locals.session,
                role: role ? role : '',
                user: req.isAuthenticated() ? username[0].info : '',
            });
        } catch (err) {
            if (err)
                console.log(err);
            next(err);
        };
    }

    // [GET] /
    async productDetail(req, res, next) {
        if (req.isAuthenticated()) {
            var user = await User.find({ 'info.firstname': req.session.User.name })
            var username = user.map(user => user = user.toObject())
            var role = username[0].role === 'admin' ? 'admin' : ''
        }
        Product.findOne({ slug: req.params.slug })
            .then((product) => {
                res.render('product/product-detail', {
                    product: mongooseToObject(product),
                    role: role,
                    user: req.isAuthenticated() ? username[0].info : '',
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
        // const products = await Product
        //     .find({ league: leagueNeededRender.name })
        //     .skip(begin)
        //     .limit(productsPerPage);
        if (req.isAuthenticated()) {
            var user = await User.find({ 'info.firstname': req.session.User.name })
            var username = user.map(user => user = user.toObject())
            var role = username[0].role === 'admin' ? 'admin' : ''
        }
        if (req.query.hasOwnProperty('_sort')) {
            var products = await Product
            .find({ deleted: 'false', league: leagueNeededRender.name, $or: [
                { quantityOfSizeS: { $gt: 0 } },
                { quantityOfSizeM: { $gt: 0 } },
                { quantityOfSizeL: { $gt: 0 } },
            ]})
                .sort({ 'price': req.query.type == 'asc' ? 1 : -1 })
                .skip(begin)
                .limit(productsPerPage);
        } else {
            var products = await Product
            .find({ deleted: 'false', league: leagueNeededRender.name, $or: [
                { quantityOfSizeS: { $gt: 0 } },
                { quantityOfSizeM: { $gt: 0 } },
                { quantityOfSizeL: { $gt: 0 } },
            ]})
                .skip(begin)
                .limit(productsPerPage);
        }
        res.render('product/shop', {
            products: multipleMongooseToObject(products),
            leagues: multipleMongooseToObject(leagues),
            clubs: multipleMongooseToObject(clubs),
            totalPage: totalPage,
            page: page,
            link: `/leagues/${req.params.league}`,
            role: role,
            user: req.isAuthenticated() ? username[0].info : '',
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
        // const products = await Product
        //     .find({ club: clubFound.name })
        //     .skip(begin)
        //     .limit(productsPerPage);

        if (req.query.hasOwnProperty('_sort')) {
            var products = await Product
            .find({ deleted: 'false', club: clubFound.name, $or: [
                { quantityOfSizeS: { $gt: 0 } },
                { quantityOfSizeM: { $gt: 0 } },
                { quantityOfSizeL: { $gt: 0 } },
            ]})
                .sort({ 'price': req.query.type == 'asc' ? 1 : -1 })
                .skip(begin)
                .limit(productsPerPage);
        } else {
            var products = await Product
            .find({ deleted: 'false', club: clubFound.name, $or: [
                { quantityOfSizeS: { $gt: 0 } },
                { quantityOfSizeM: { $gt: 0 } },
                { quantityOfSizeL: { $gt: 0 } },
            ]})
                .skip(begin)
                .limit(productsPerPage);
        }
        if (req.isAuthenticated()) {
            var user = await User.find({ 'info.firstname': req.session.User.name })
            var username = user.map(user => user = user.toObject())
            var role = username[0].role === 'admin' ? 'admin' : ''
        }
        res.render('product/shop', {
            products: multipleMongooseToObject(products),
            leagues: multipleMongooseToObject(leagues),
            clubs: multipleMongooseToObject(clubs),
            totalPage: totalPage,
            page: page,
            link: `/clubs/${req.params.club}`,
            role: role,
            user: req.isAuthenticated() ? username[0].info : '',
        })
    }

    // [GET] /product/add-to-cart/:id
    addProductToCart(req, res, next) {
        // check if number of product is provided
        let numberOfProduct;
        if (req.body.numberOfProduct) {
            numberOfProduct = req.body.numberOfProduct;
        }
        else {
            numberOfProduct = 1;
        }

        let productID = req.params.id;
        let sessionID = req.signedCookies.sessionId;
        Session.findOne({ sessionId: sessionID })
            .then((session) => {
                let count = session.cart.get(productID) || 0;
                Product.findOne({ _id: productID }).then(product => {
                    if (product.quantityOfSizeS > 0) {
                        session.size.set(productID, 'S');
                    }
                    else if (product.quantityOfSizeS == 0) {
                        session.size.set(productID, 'M');
                    }
                    else if (product.quantityOfSizeM == 0) {
                        session.size.set(productID, 'L');
                    }

                    session.cart.set(productID, count + numberOfProduct);
                    session.totalProducts += numberOfProduct;
                    session.save((err) => {
                        if (err)
                            console.log(err);
                        /* res.json({
                            totalProducts: session.totalProducts,
                            isInCart: count,
                        }); */
                        res.redirect('back');
                    })
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
                //session.size.delete(productID);   
                session.totalProducts -= count;
                session.save((err) => {
                    if (err)
                        console.log(err);
                    /* res.json({
                        totalProducts: session.totalProducts
                    }); */
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
        if (input.currentSize == 'S' && product.quantityOfSizeS < input.numberOfProduct) {
            error = 'Number of product is over in stock'
            input.numberOfProduct = product.quantityOfSizeS;
        }
        if (input.currentSize == 'M' && product.quantityOfSizeM < input.numberOfProduct) {
            error = 'Number of product is over in stock'
            input.numberOfProduct = product.quantityOfSizeM;
        }
        if (input.currentSize == 'L' && product.quantityOfSizeL < input.numberOfProduct) {
            error = 'Number of product is over in stock'
            input.numberOfProduct = product.quantityOfSizeL;
        }

        let sessionId = req.signedCookies.sessionId;
        let session = await Session.findOne({ sessionId: sessionId });
        let numberOfProductBeforeUpdate = session.cart.get(productId);
        session.cart.set(productId, input.numberOfProduct);
        session.size.set(productId, input.currentSize);
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

    async confirmCheckout(req, res) {
        let input = req.body;
        console.log(input);
        input.cart = {};
        input.size = {};
        let session = res.locals.session;
        for (let [key, value] of session.cart.entries()) {
            Object.assign(input.cart, {
                [key]: value
            })
        };
        for (let [key, value] of session.size.entries()) {
            Object.assign(input.size, {
                [key]: value
            })
        };
        input.payment = res.locals.totalPriceInCart;
        const newCheckout = new Checkout({
            ...input
        });
        await newCheckout.save();

        // set new inventory
        let productList = [];
        for (const [key, value] of Object.entries(input.cart)) {
            productList.push({
                id: key,
                quantity: value
            });
        }
        let indexOfProductList = 0;
        for (const [key, value] of Object.entries(input.size)) {
            Object.assign(productList[indexOfProductList], {
                size: value
            });        
            indexOfProductList++;
        }
        console.log(productList);
        for (let i = 0; i < productList.length; i++) {
            let product = await Product.findOne({ _id: productList[i].id }).lean();
            if (productList[i].size == 'S') {
                product.quantityOfSizeS -= productList[i].quantity;
            }
            if (productList[i].size == 'M') {
                product.quantityOfSizeM -= productList[i].quantity;
            }
            if (productList[i].size == 'L') {
                product.quantityOfSizeL -= productList[i].quantity;
            }
            await Product.updateOne({ _id: productList[i].id }, product);
        }

        const html=`     
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="background-color: #eeeeee;" bgcolor="#eeeeee">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
                            <tr>
                                <td align="center" valign="top" style="font-size:0; padding: 35px;" bgcolor="#F44336">
                                    <div style="display:inline-block; max-width:50%; min-width:100px; vertical-align:top; width:100%;">
                                        <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:300px;">
                                            <tr>
                                                <td align="left" valign="top" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 36px; font-weight: 800; line-height: 48px;" class="mobile-center">
                                                    <h1 style="font-size: 36px; font-weight: 800; margin: 0; color: #ffffff;">FashiShop</h1>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div style="display:inline-block; max-width:50%; min-width:100px; vertical-align:top; width:100%;" class="mobile-hide">
                                        <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:300px;">
                                            <tr>
                                                <td align="right" valign="top" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; line-height: 48px;">
                                                    <table cellspacing="0" cellpadding="0" border="0" align="right">
                                                        <tr>
                                                            <td style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400;">
                                                                <p style="font-size: 18px; font-weight: 400; margin: 0; color: #ffffff;"><a href="#" target="_blank" style="color: #ffffff; text-decoration: none;">Shop &nbsp;</a></p>
                                                            </td>
                                                            <td style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 24px;"> <a href="#" target="_blank" style="color: #ffffff; text-decoration: none;"><img src="https://img.icons8.com/color/48/000000/small-business.png" width="27" height="23" style="display: block; border: 0px;" /></a> </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 35px 35px 20px 35px; background-color: #ffffff;" bgcolor="#ffffff">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
                                        <tr>
                                            <td align="center" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding-top: 25px;"> <img src="https://img.icons8.com/carbon-copy/100/000000/checked-checkbox.png" width="125" height="120" style="display: block; border: 0px;" /><br>
                                                <h2 style="font-size: 30px; font-weight: 800; line-height: 36px; color: #333333; margin: 0;"> Thank You For Your Order! </h2>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="left" style="padding-top: 20px;">
                                                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                                    <tr>
                                                        <td width="75%" align="left" bgcolor="#eeeeee" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; line-height: 24px; padding: 10px;"> Order Confirmation # </td>
                                                        <td width="25%" align="left" bgcolor="#eeeeee" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; line-height: 24px; padding: 10px;">${Math.floor(Math.random() * 10000)}</td>
                                                    </tr>
                    
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="left" style="padding-top: 20px;">
                                                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                                    <tr>
                                                        <td width="75%" align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; line-height: 24px; padding: 10px; border-top: 3px solid #eeeeee; border-bottom: 3px solid #eeeeee;"> TOTAL </td>
                                                        <td width="25%" align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; line-height: 24px; padding: 10px; border-top: 3px solid #eeeeee; border-bottom: 3px solid #eeeeee;">${res.locals.totalPriceInCart}</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" height="100%" valign="top" width="100%" style="padding: 0 35px 35px 35px; background-color: #ffffff;" bgcolor="#ffffff">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px;">
                                        <tr>
                                            <td align="center" valign="top" style="font-size:0;">
                                                <div style="display:inline-block; max-width:50%; min-width:240px; vertical-align:top; width:100%;">
                                                    <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:300px;">
                                                        <tr>
                                                            <td align="left" valign="top" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px;">
                                                                <p style="font-weight: 800;">Delivery Address</p>
                                                                <p>${req.body.address}</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <div style="display:inline-block; max-width:50%; min-width:240px; vertical-align:top; width:100%;">
                                                    <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:300px;">
                                                        <tr>
                                                            <td align="left" valign="top" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px;">
                                                                <p style="font-weight: 800;">Estimated Delivery Date</p>
                                                                <p>Đơn hàng của bạn sẽ được giao trong vòng 3 - 5 ngày</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style=" padding: 35px; background-color: #ff7361;" bgcolor="#1b9ba3">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">                                  
                                        <tr>
                                            <td align="center" style="padding: 25px 0 15px 0;">
                                                <table border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td align="center" style="border-radius: 5px;" bgcolor="#66b3b7"> <a href="http://localhost:3000/" target="_blank" style="font-size: 18px; font-family: Open Sans, Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 5px; background-color: #F44336; padding: 15px 30px; border: 1px solid #F44336; display: block;">Shop Again</a> </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                        </table>
                    </td>
                </tr>
            </table>`
        sendEmail(req.body.email,'Đơn hàng FashiShop',html)

        // clear session
        res.clearCookie('sessionId');

        // show alert and redirect
        res.write("<script language='javascript'>window.alert('Order successfully');window.location='/';</script>");
    }
}

module.exports = new ProductController();
