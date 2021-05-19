const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Product = new Schema({
    
    name: { type: String, maxLength:255},
    price: { type: String ,maxLength:255},
    category: {type: String, maxLength:255},
    description:{type: String,maxLength: 600},
    image:{type: String,maxLength: 255},
    gender: { type: String ,maxLength: 255},

    },{
        timestamps: true,
    });

module.exports = mongoose.model('Product', Product);