const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;



const Product = new Schema({
    id: mongoose.ObjectId,
    name: { type: String, maxLength: 255 },
    price: { type: String, maxLength: 255 },
    category: { type: String, maxLength: 255 },
    description: { type: String, maxLength: 600 },
    image: { type: String, maxLength: 255 },
    gender: { type: String, maxLength: 255 },
    size: { type: String, maxLength: 3 },
    quantity: { type: Number },
    slug: { type: String, slug: "name" }
}, {
    timestamps: true,
});

  //Custom query helpers

  Product.query.sortable = function(req) {
    if(req.query.hasOwnProperty('_sort')) {

      const isValidtype = ['asc', 'desc'].includes(req.query.type);
          return this.sort({
          [req.query.column]: isValidtype ? req.query.type: 'desc',
      });
   }
    return this;
  }

Product.plugin(mongoose_delete, { deletedAt : true ,overrideMethods: 'all'} )
mongoose.plugin(slug);

module.exports = mongoose.model('Product', Product);