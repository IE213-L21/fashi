const siteRouter = require('./site');
const blogRouter = require('./blog');
const accountRouter = require('./account');
const productRouter = require('./product');
const adminRouter = require('./admin');

function route(app) {
    app.use('/blogs', blogRouter);
    app.use('/account', accountRouter);
    app.use('/product', productRouter);
    app.use('/admin', adminRouter);
    app.use('/', siteRouter);
}

module.exports = route;