const User = require('../models/user');
const session = require('express-session');

class SiteController {

    // [GET] /
    index(req, res) {
        if(req.isAuthenticated()){
            console.log("đã đăng nhập")
            User.find({'info.firstname':req.session.User.name})
                .then((user)=>{
                    console.log(user)
                    const username = user.map(user=>user=user.toObject())
                    res.render('index',{
                        user: username[0].info
                    })
                })
        }else{
            console.log("chưa đăng nhập")
            res.render('index')
        }
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
