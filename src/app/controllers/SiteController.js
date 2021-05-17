class SiteController {

    // [GET] /
    index(req, res) {
         res.render('index')
    }

    //trang liên hệ
    contact(req, res){
        res.render('contact');
    }

   //trang không biết
    main(req, res){
        res.render('main');
    }
}

module.exports = new SiteController();
