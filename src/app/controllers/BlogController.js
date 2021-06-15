const User = require('../models/user');
class BlogController {

    // [GET] /
    blog(req, res) {
        if(req.isAuthenticated()){
            User.find({'info.firstname':req.session.User.name})
                .then((user)=>{                   
                    const username = user.map(user=>user=user.toObject())
                    const role = username[0].role==='admin' ? 'admin' : ''
                    res.render('blogs/blog',{
                        user: username[0].info,
                        role
                    })
                })
        }else{           
            res.render('blogs/blog');
        }
    }
     
    // [GET] /
    blogDetail(req, res) {
        if(req.isAuthenticated()){
            User.find({'info.firstname':req.session.User.name})
                .then((user)=>{                   
                    const username = user.map(user=>user=user.toObject())
                    const role = username[0].role==='admin' ? 'admin' : ''
                    res.render('blogs/blog-details',{
                        user: username[0].info,
                        role
                    })
                })
        }else{           
            res.render('blogs/blog-details');
        }
    }

    // [GET] /
    faq(req, res) {
        if(req.isAuthenticated()){
            User.find({'info.firstname':req.session.User.name})
                .then((user)=>{                   
                    const username = user.map(user=>user=user.toObject())
                    const role = username[0].role==='admin' ? 'admin' : ''
                    res.render('blogs/faq',{
                        user: username[0].info,
                        role
                    })
                })
        }else{           
            res.render('blogs/faq');
        }
    }   
}

module.exports = new BlogController();
