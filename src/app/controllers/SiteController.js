const User = require('../models/user');
const session = require('express-session');

class SiteController {

    // [GET] /
    index(req, res) {
        if(req.isAuthenticated()){
            User.find({'info.firstname':req.session.User.name})
                .then((user)=>{                   
                    const username = user.map(user=>user=user.toObject())
                    const role = username[0].role==='admin' ? 'admin' : ''
                    res.render('index',{
                        user: username[0].info,
                        role
                    })
                })
        }else{
            res.render('index')
        }
    }

    //trang liên hệ
    contact(req, res){
        if(req.isAuthenticated()){
            User.find({'info.firstname':req.session.User.name})
                .then((user)=>{                   
                    const username = user.map(user=>user=user.toObject())
                    const role = username[0].role==='admin' ? 'admin' : ''
                    res.render('contact',{
                        user: username[0].info,
                        role
                    })
                })
        }else{
            res.render('contact');
        }
        }

   //trang không biết
    main(req, res){
        if(req.isAuthenticated()){
            User.find({'info.firstname':req.session.User.name})
                .then((user)=>{                   
                    const username = user.map(user=>user=user.toObject())
                    const role = username[0].role==='admin' ? 'admin' : ''
                    res.render('main',{
                        user: username[0].info,
                        role
                    })
                })
        }else{           
            res.render('main');
        }
    }
}

module.exports = new SiteController();
