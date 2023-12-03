const productSchema = require('../models/product');
const user = require('../models/user');
const userSchema = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const carController = {}

carController.addToCart = async (req, res) => {

  try {

    const { username, id, cantidad : cantidadBody } = req.body;
    const cantidad = parseInt(cantidadBody, 10);

    if (isNaN(cantidad)) return res.json({ add: false, error: "Cantidad no es un número válido" });
    if (!cantidad) return res.json({ add: false, error: "Cantidad no definida" });
    if (!ObjectId.isValid(id)) return res.json({ add: false, error: "Producto no encontrado" });

    const product = await productSchema.findById(id);
    const user = await userSchema.findOne({ username: username });

    if (!product || !user) { 
      return res.json({ add: false, error: "Usuario y/o Producto no encontrado" });
    }

    const existingProduct = user.shopping_car.products.find(product => product._id.toString() === id.toString());

    if (existingProduct) {

      // Si el producto ya existe, aumentar la cantidad
      existingProduct.cantidad += cantidad
      user.shopping_car.total += existingProduct.price * cantidad;
      user.shopping_car.cantidad += cantidad;

      await user.save();
  
      return res.json({ add: true, user: user.username, car: user.shopping_car, message: `Producto agregado al carrito!` });

    } else {

      const newCartItem = {
        _id: product._id,
        product: product.product,
        brand: product.brand,
        category: product.category,      
        price: product.price,
        img: product.img,
        filename: product.filename,
        cantidad: cantidad,
      }
  
      user.shopping_car.products.push(newCartItem);
      user.shopping_car.total += newCartItem.price * cantidad;
      user.shopping_car.cantidad += cantidad;
      
      await user.save();
  
      return res.json({ add: true, user: user.username, car: user.shopping_car, message: `${newCartItem.product} agregado al carrito!` });

    }

  } catch (err) {
    console.log(err);
    return res.status(500).json({ add: false, error: "Error interno en el servido" });
  }

}

carController.removeToCart = async (req, res) => {

  try {

    const { username, id, cantidad: cantidadBody } = req.body;
  
    const cantidad = parseInt(cantidadBody, 10);

    if (isNaN(cantidad)) return res.json({ delete: false, error: "Cantidad no es un número válido" });
    if (!cantidad) return res.json({ delete: false, error: "Cantidad no definida" });
    if (!ObjectId.isValid(id)) return res.json({ remove: false, error: "Id no valido" });

    const user = await userSchema.findOne({ username: username });

    if (!user) { 
      return res.json({ remove: false, error: "Usuario no encontrado" });
    }

    const existingProduct = user.shopping_car.products.find(product => product._id.toString() === id.toString());
    
    if (existingProduct) {
      
      // Si el producto ya existe, reducir la cantidad
      const resultCantidad = existingProduct.cantidad - cantidad;
      
      // Eliminar el producto si la cantidad es menor o igual a 0
      if (resultCantidad <= 0) {

        user.shopping_car.total -= existingProduct.price * existingProduct.cantidad;
        user.shopping_car.cantidad -= existingProduct.cantidad;
        user.shopping_car.products = user.shopping_car.products.filter(product => product._id.toString() !== id.toString());
      
      } else {        

        existingProduct.cantidad -= cantidad;
        user.shopping_car.total -= existingProduct.price * cantidad;
        user.shopping_car.cantidad -= cantidad;

      }

      await user.save();
  
      return res.json({ delete: true, user: user.username, car: user.shopping_car, message: `Producto quitado del carrito!` });

    } 

    return res.json({ delete: false, message: `Item no encontrado dentro del carrito` });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ delete: false, error: "Error interno en el servido" });
  }

}

carController.removeAllCart =  async (req, res) => {

  try {

    const { username } = req.params;

    const user = await userSchema.findOne({ username: username });

    if (!user) { 
      return res.json({ remove: false, error: "Usuario no encontrado" });
    }

    user.shopping_car.products = [];
    user.shopping_car.total = 0;
    user.shopping_car.cantidad = 0;

    await user.save(); 
      
    return res.json({ remove: true, user: user.username, car: user.shopping_car, message: `Carrito vaciado correctamente!` });


  } catch (err) {
    console.log(err);
    return res.status(500).json({ remove: false, error: "Error interno en el servido" });
  }
};

module.exports = carController