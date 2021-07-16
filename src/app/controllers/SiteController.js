const User = require('../models/user');
const session = require('express-session');
const Product = require('../models/product');
const { mongooseToObject}=require('../../util/mongoose')
const {multipleMongooseToObject}= require('../../util/mongoose')

class SiteController {

    // [GET] /
    async index(req, res) {
        if(req.isAuthenticated()){
            const productLaLiga = await Product.find({league:"La Liga"})
            const productPremierLeague = await Product.find({league:"Premier League"})
            const user = await User.find({'info.firstname':req.session.User.name})
            const username = user.map(user=>user=user.toObject())
            const role = username[0].role==='admin' ? 'admin' : ''
            res.render('index',{
                laLiga:multipleMongooseToObject(productLaLiga),
                permierLeague:multipleMongooseToObject(productPremierLeague),
                user: username[0].info,
                role
            })
        }else{
            const productLaLiga = await Product.find({league:"La Liga"})
            const productPremierLeague = await Product.find({league:"Premier League"})
            res.render('index',{
                laLiga:multipleMongooseToObject(productLaLiga),
                permierLeague:multipleMongooseToObject(productPremierLeague)
            })
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
