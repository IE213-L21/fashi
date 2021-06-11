const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    id: mongoose.ObjectId,
    account: { type: String, maxLength: 255, required: true },
    hashedPassword: { type: String, maxLength: 255, required: true },
    name: { type: String, maxLength: 255, required: true },
    phoneNumber: { type: String, maxLength: 255, required: true },
    email: { type: String, maxLength: 255, required: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Admin', AdminSchema);