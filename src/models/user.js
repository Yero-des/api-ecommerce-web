const mongoose = require('mongoose');

// Schema
const userSchema = mongoose.Schema({  
  //_id: {type:String},
  name: {type: String, required: true,},
  last_name: {type: String, required: true,},
  email: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  admin: {type: Boolean, required: true, default: false},

  shopping_car: {

    total: {type: Number, required: true, default: 0},
    cantidad: {type: Number, required: true, default: 0},

    products: [
      {
        product: {type: String, required: true},
        brand: {type: String, required: true},
        category: {type: String, required: true},
        price: {type: Number, required: true},
        img: {type: String, required: true},
        filename: {type: String, required: true},
        cantidad: {type: Number, required: true},
      }
    ]

  }
})



module.exports = mongoose.model('user', userSchema);



