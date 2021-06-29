const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CheckoutSchema = new Schema({
    id: mongoose.ObjectId,
    firstname: { type: String, maxLength: 255, required: true },
    lastname: { type: String, maxLength: 255, required: true },
    address: { type: String, maxLength: 255, required: true },
    email: { type: String, maxLength: 255, required: true },
    phone: { type: Number, minLength: 10, maxLength: 10, required: true },
    cart: { type: Map, of: Number },
    size: { type: Map, of: String },
    paymentMethod: { type: String, required: true},
    payment: { type: Number, required: true},
}, {
    timestamps: true,
});


module.exports = mongoose.model('Checkout', CheckoutSchema);