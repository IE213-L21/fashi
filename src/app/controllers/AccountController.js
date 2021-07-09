const bcrypt = require('bcrypt');

const User = require('../models/user.js');

class AccountController {

    // [GET] /
    login(req, res) {
        const messages = req.flash('error');
        res.render('account/login', {
            messages: messages
        });
    }

    // [GET] /
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
            const user = await User.find({ 'info.firstname': req.session.User.name });
            const username = user.map(user => user = user.toObject());
            const role = username[0].role === 'admin' ? 'admin' : '';
            try {
                res.render('account/change-password', {
                    role: role,
                    user: username[0].info,
                });
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

        const user = await User.find({ 'info.firstname': req.session.User.name });
        const username = user.map(user => user = user.toObject());
        const role = username[0].role === 'admin' ? 'admin' : '';
        // validation new password
        if (input.newPassword !== input.confirmPassword) {
            const message = 'New password and confirm password must be similar';
            return res.render('account/change-password', {
                message,
                role,
                user: username[0].info,
            })
        }

        // check old password
        let currentUser = await User.findOne({ _id: req.session.passport.user });
        let isTruePassword = await bcrypt.compare(input.oldPassword, currentUser.local.password);
        if (!isTruePassword) {
            const message = 'Wrong password';
            return res.render('account/change-password', {
                message,
                role,
                user: username[0].info,
            })
        }
        else {
            currentUser.local.password = bcrypt.hashSync(input.newPassword, 10);
            await User.updateOne({ _id: req.session.passport.user }, currentUser);
            const message = 'Change password succesfully';
            return res.render('account/change-password', {
                message,
                role,
                user: username[0].info,
            })
        }
    }
}

module.exports = new AccountController();
