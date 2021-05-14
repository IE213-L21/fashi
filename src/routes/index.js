const productRoutes = require('./productRoutes')

function route(app){
    app.use('/',productRoutes)

}
module.exports = route 