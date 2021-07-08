const User = require('../models/user.js');

async function showUserInfo(req, res, next) {
    if (req.isAuthenticated()) {
        const currentUser = await User.findOne({ _id: req.session.passport.user }).lean();
        const role = currentUser.role === 'admin' ? 'admin' : '';
        res.locals.email = currentUser.local.email;
        res.locals.role = role;
        res.locals.user = currentUser.info;
    }
    else {
        res.locals.role = "";
        res.locals.user = "";
        res.locals.email = "";
    }
    next();
}

module.exports = {
    showUserInfo
}