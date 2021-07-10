const mongoose = require('mongoose');

async function connect() {
    try { 
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Connect successfully !!');
    } catch (error) {
        console.log('Connect failure !!')
    }

}

module.exports = { connect }