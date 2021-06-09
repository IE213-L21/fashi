const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    id: mongoose.ObjectId,
    name: { type: String, maxLength: 255, required: true },
    price: { type: String, maxLength: 255, required: true },
    category: { type: String, maxLength: 255 },
    description: { type: String, maxLength: 600, required: true },
    gender: { type: String, maxLength: 255 },
    image: { type: String, maxLength: 255 },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true },
    slug: { type: String, slug: "name" },
}, {
    timestamps: true,
});

  //Custom query helpers

  ProductSchema.query.sortable = function(req) {
    if(req.query.hasOwnProperty('_sort')) {

      const isValidtype = ['asc', 'desc'].includes(req.query.type);
          return this.sort({
          [req.query.column]: isValidtype ? req.query.type: 'desc',
      });
   }
    return this;
  }

ProductSchema.plugin(mongoose_delete, { deletedAt : true ,overrideMethods: 'all'} )
mongoose.plugin(slug);

module.exports = mongoose.model('Product', ProductSchema);