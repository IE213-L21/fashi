const Session = require('../models/sessionID');
const Product = require('../models/product');

async function renderCart(req, res, next) {
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
            productsInCart.push(productInCart)
        }
        session = session.toObject();
    }
    else
        session = [];
    res.locals.session = session;
    res.locals.totalProductsInCart = totalProductsInCart;
    res.locals.productsInCart = productsInCart;
    res.locals.totalPriceInCart = totalPriceInCart;
    next();
}

module.exports = renderCart;