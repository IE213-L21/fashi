const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

const LeagueSchema = new Schema({
    id: mongoose.ObjectId,
    name: { type: String, maxLength: 255, required: true },
    slug: { type: String, slug: "name" },
    club: [{ type: Schema.Types.ObjectId, ref: 'Club'}]
}, {
    timestamps: true,
});

mongoose.plugin(slug);

module.exports = mongoose.model('League', LeagueSchema);