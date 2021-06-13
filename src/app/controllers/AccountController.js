class AccountController {

    // [GET] /
    login(req, res) {
        console.log(req.session.User)
        res.render('account/login');
    }
     
    // [GET] /
    register(req, res) {
        res.render('account/register');
    }
   
}

module.exports = new AccountController();
