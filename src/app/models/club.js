const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

const ClubSchema = new Schema({
    id: mongoose.ObjectId,
    name: { type: String, maxLength: 255, required: true },
    slug: { type: String, slug: "name" },
    league: { type: Schema.Types.ObjectId, ref: 'League'}
}, {
    timestamps: true,
});

mongoose.plugin(slug);

module.exports = mongoose.model('Club', ClubSchema);