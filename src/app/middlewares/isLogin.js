const User = require('../models/user.js');

async function showUserInfo(req, res, next) {
    if (req.isAuthenticated()) {
        const user = await User.find({ 'info.firstname': req.session.User.name });
        const username = user.map(user => user = user.toObject());
        const role = username[0].role === 'admin' ? 'admin' : '';
        res.locals.email = username[0].local.email;
        res.locals.role = role;
        res.locals.user = username[0].info;
    }
    else {
        res.locals.role = "";
        res.locals.user = "";
    }
    next();
}

module.exports = {
    showUserInfo
}