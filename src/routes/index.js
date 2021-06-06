const siteRouter = require('./site');
const blogRouter = require('./blog');
const accountRouter = require('./account');
const shopRouter = require('./shop');
const adminRouter = require('./admin');



function route(app) {
    app.use('/blogs', blogRouter);
    app.use('/account', accountRouter);
    app.use('/product', shopRouter);
    app.use('/admin', adminRouter);
    app.use('/', siteRouter);
}

module.exports = route;