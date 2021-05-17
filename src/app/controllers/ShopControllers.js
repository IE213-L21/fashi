
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
    shop(req, res) {
        res.render('shops/shop');
    }
    
    // [GET] /
    shoppingCart(req, res) {
        res.render('shops/shopping-cart');
    }
     
}

module.exports = new ShopController();
