const mongoose = require('mongoose');

async function connect() {
    try { 
        await mongoose.connect('mongodb+srv://Sa:18521330@cluster0.fxllx.mongodb.net/fashi?retryWrites=true&w=majority', {
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

module.exports = {connect}