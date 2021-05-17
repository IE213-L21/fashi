const siteRouter = require('./site');
const blogRouter = require('./blog');
const accountRouter = require('./account');
const shopRouter = require('./shop');
const productRouter = require('./admin');

function route(app) {
    app.use('/blogs', blogRouter);
    app.use('/account', accountRouter);
    app.use('/shops', shopRouter);
    app.use('/admin', productRouter);
    app.use('/', siteRouter);
}

module.exports = route;