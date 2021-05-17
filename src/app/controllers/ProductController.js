
class ProductController {

    createProduct(req, res) {
        res.render('product/create-product')
    }

    editProduct(req, res) {
        res.render('product/edit-product')
    }

}

module.exports = new ProductController;
