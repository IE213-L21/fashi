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
   
}

module.exports = new AccountController();
