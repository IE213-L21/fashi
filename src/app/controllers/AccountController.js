class AccountController {

    // [GET] /
    login(req, res) {
        res.render('account/login');
    }
     
  
     
    // [GET] /
    register(req, res) {
        res.render('account/register');
    }

    logout(req, res) {
        req.session.destroy();
        res.redirect('/')
    }
   
}

module.exports = new AccountController();
