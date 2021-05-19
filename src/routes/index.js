const siteRouter = require('./site');
const blogRouter = require('./blog');
const accountRouter = require('./account');
const shopRouter = require('./shop');
const admintRouter = require('./admin');

function route(app) {
    app.use('/blogs', blogRouter);
    app.use('/account', accountRouter);
    app.use('/shops', shopRouter);
    app.use('/admin', admintRouter);
    app.use('/', siteRouter);
}

module.exports = route;