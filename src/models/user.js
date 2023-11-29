const mongoose = require('mongoose');

// Schema
const userSchema = mongoose.Schema({  

  name: {type: String, required: true,},
  last_name: {type: String, required: true,},
  email: {type: String, required: true},
  username: {type: String, required: true,},
  password: {type: String, required: true},
  admin: {type: Boolean, required: true, default: false},

  shopping_car: {

    total: {type: Number, required: true, default: 0},
    subtotal: {type: Number, required: true, default: 0},

    products: [
      {
        product: {type: String, required: true},
        price: {type: Number, required: true},
        description: {type: String, required: false},
        image: {type: String, required: false}
      }
    ]

  }
})

module.exports = mongoose.model('user', userSchema);



