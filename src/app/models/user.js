var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    info: {
        firstname: String,
        lastname: String,
        phonenumber: String,
        address: String
    },
    local: {
        email: {
            type: String
        },
        password: {
            type: String
        }
    },
    role: String,
});

module.exports = mongoose.model('User', userSchema);