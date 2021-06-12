const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SessionIDSchema = new Schema({
    id: mongoose.ObjectId,
    sessionId: { type: String, required: true},
    cart: { type: Map, of: Number }
}, {
    timestamps: true,
});

module.exports = mongoose.model('SessionID', SessionIDSchema);