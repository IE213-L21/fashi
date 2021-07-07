class AccountController {

    // [GET] /
    login(req, res) {
        const messages = req.flash('error')
        res.render('account/login',{
            messages: messages
        });
    }
     
  
     
    // [GET] /
    register(req, res) {
        res.render('account/register');
    }

    logout(req, res) {
        req.session.destroy();
        res.redirect('/')
    }

    // [GET] /account/setting
    setting(req, res) {
        res.render('account/setting');
    }
   
    // [POST] /account/setting
    changePassword(req, res) {
        let input = req.body;
        res.json(input);
    }
}

module.exports = new AccountController();
