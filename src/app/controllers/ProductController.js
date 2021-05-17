
class ProductController {

    createProduct(req, res) {
        res.render('admin/create-product')
    }

    editProduct(req, res) {
        res.render('admin/edit-product')
    }

}

module.exports = new ProductController;
