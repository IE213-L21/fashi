module.exports = function authenticated(req, res, next) {
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.redirect('/account/login')
    }
}