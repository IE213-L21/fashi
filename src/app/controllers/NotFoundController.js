const User = require('../models/user');

module.exports = async function notfound(req, res){
    if(req.isAuthenticated()){
        User.find({'info.firstname':req.session.User.name})
            .then((user)=>{                   
                const username = user.map(user=>user=user.toObject())
                const role = username[0].role==='admin' ? 'admin' : ''
                res.render('404',{
                    user: username[0].info,
                    role
                })
            })
    }else{           
        res.render('404');  
    }
}
