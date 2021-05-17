class BlogController {

    // [GET] /
    blog(req, res) {
        res.render('blogs/blog');
    }
     
    // [GET] /
    blogDetail(req, res) {
        res.render('blogs/blog-details');
    }

    // [GET] /
    faq(req, res) {
        res.render('blogs/faq');
    }   
}

module.exports = new BlogController();
