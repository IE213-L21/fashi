const siteRouter = require('./site');
const blogRouter = require('./blog');
const accountRouter = require('./account');
const productRouter = require('./product');
const adminRouter = require('./admin');

const adminAuthentication = require('../app/middlewares/adminAuthentication');

function route(app) {
    app.use('/blogs', blogRouter);
    app.use('/account', accountRouter);
    app.use('/product', productRouter);
    app.use('/admin', adminAuthentication, adminRouter);
    app.use('/', siteRouter);
    app.use('/*',function(req,res){
        res.render('404')
    })
}

module.exports = route;