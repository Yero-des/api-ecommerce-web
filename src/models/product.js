const mongoose = require('mongoose');

// Schema
const productSchema = mongoose.Schema({  
  product: {type: String, required: true},
  brand: {type: String, required: true},
  category: {type: String, required: true},
  price: {type: Number, required: true},
  img: {type: String, required: true},
  filename: {type: String, required: true}
})

productSchema.methods.setImgUrl = function setImgUrl(filename) {  
  this.filename = filename;
  this.img = `${process.env.APP_HOST}:${process.env.APP_PORT}/public/${filename}`;
}

module.exports = mongoose.model('product', productSchema);

