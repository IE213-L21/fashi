const siteRouter = require('./site');
const blogRouter = require('./blog');
const accountRouter = require('./account');
const productRouter = require('./product');
const adminRouter = require('./admin');
const notfound = require('../app/controllers/NotFoundController');

const showUserInfo = require('../app/middlewares/showUserInfo.js');
const adminAuthentication = require('../app/middlewares/adminAuthentication');

function route(app) {
    app.use('/blogs', showUserInfo, blogRouter);
    app.use('/account', showUserInfo, accountRouter);
    app.use('/product', showUserInfo, productRouter);
    app.use('/admin', showUserInfo, adminAuthentication, adminRouter);
    app.use('/', showUserInfo, siteRouter);
    //app.use('/*', notfound)
}

module.exports = route;