const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = require('./product');

const Cart = new Schema({
    id: String,
    total_price: Number,

}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', Product);