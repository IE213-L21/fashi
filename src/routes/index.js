const siteRouter = require('./site');
const blogRouter = require('./blog');
const accountRouter = require('./account');
const productRouter = require('./product');
const adminRouter = require('./admin');
const notfound = require('../app/controllers/NotFoundController')
const { showUserInfo } = require('../app/middlewares/isLogin');

const adminAuthentication = require('../app/middlewares/adminAuthentication');

function route(app) {
    app.use('/blogs', blogRouter);
    app.use('/account', accountRouter);
    app.use('/product', productRouter);
    app.use('/admin', adminAuthentication, adminRouter);
    app.use('/',showUserInfo, siteRouter);
    //app.use('/*', notfound)
}

module.exports = route;