const bcrypt = require('bcrypt');

const User = require('../models/user.js');

class AccountController {

    // [GET] /account/login
    login(req, res) {
        const messages = req.flash('error');
        res.render('account/login', {
            messages: messages
        });
    }

    // [GET] /account/register
    register(req, res) {
        res.render('account/register');
    }

    logout(req, res) {
        req.session.destroy();
        res.redirect('/');
    }

    // [GET] /account/setting
    async changePassword(req, res) {
        if (req.isAuthenticated()) {
            try {
                res.render('account/change-password');
            } catch (err) {
                if (err)
                    next(err);
            }
        }
        else {
            try {
                res.redirect('/account/login');
            } catch (err) {
                if (err)
                    next(err);
            }
        }
    }

    // [POST] /account/setting
    async sendChangePassword(req, res) {
        let input = req.body;

        // validation new password
        if (input.newPassword !== input.confirmPassword) {
            const message = 'New password and confirm password must be similar';
            return res.render('account/change-password', {
                message,
            })
        }

        // check old password
        let currentUser = await User.findOne({ _id: req.session.passport.user });
        let isTruePassword = await bcrypt.compare(input.oldPassword, currentUser.local.password);
        if (!isTruePassword) {
            const message = 'Wrong password';
            return res.render('account/change-password', {
                message,
            });
        }
        else {
            currentUser.local.password = bcrypt.hashSync(input.newPassword, 10);
            await User.updateOne({ _id: req.session.passport.user }, currentUser);
            const message = 'Change password succesfully';
            return res.render('account/change-password', {
                message,
            });
        }
    }
}

module.exports = new AccountController();
