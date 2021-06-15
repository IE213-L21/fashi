module.exports = function adminAuthentication(req, res, next) {
    if(req.isAuthenticated() && (req.session.User.role==='admin')){
        next();
    }
    else{
        res.redirect('/account/login')
    }
}