const productSchema = require('../models/product');
const mongoose = require('mongoose');
const upload = require('../libs/storage');
const ObjectId = mongoose.Types.ObjectId;
const fs = require('fs');
const path = require('path');


const productController = {}


productController.listProducts = async (req, res) => {

  try {

    const products = await productSchema.find({})
    return res.json(products);    

  } catch (err) {
    console.error(err);
    return res.json({ add: false, error: 'Error interno en el servidor'});
  }

}

productController.findProductById = async (req, res) => {

  try {
    const { id } = req.params
    
    if (!ObjectId.isValid(id)) return res.json({ find: false, message: 'Producto no encontrado'});

    product = await productSchema.findById(id);

    if (!product) return res.json({ find: false, message: 'Producto no encontrado'});    

    return res.json({ find: true, product: product, message: 'Producto encontrado' });

  } catch (err) {
    console.error(err);
    return res.json({ find: false, message: "Error interno en el servidor" });
  }

}

productController.addProduct = async (req, res) => {

  try {

    const { product: productParameter , brand, category, price } = req.body  
    
    if (price < 0){

      // Eliminar archivo (error)
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }

      return res.json({ create: false, message: 'El precio no puede ser negativo' });
    } 

    // Agregar nuevo usuario
    const product = productSchema({
      product: productParameter,
      brand: brand,
      category: category,
      price: price
    })

    if (req.file) {
      const { filename } = req.file
      product.setImgUrl(filename);
    }

    await product.save();

    return res.json({ create: true, message: "Nuevo producto agregado!", product: product });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ create: false, message: 'Error interno del servidor'});
  }

}

productController.updateProduct = async (req, res) => {

  try {

    const { id } = req.params;
    const { product, brand, category, price } = req.body;

    if (price < 0) {
      // Eliminar archivo (error)
      if (req.file && req.file.path) {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
      return res.json({ create: false, message: 'El precio no puede ser negativo' });
    }

    if (!ObjectId.isValid(id)) {
      // Eliminar archivo (error)
      if (req.file && req.file.path) {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
      return res.json({ find: false, message: 'Producto no encontrado'});
    } 
    
    const productBefore = await productSchema.findById(id, {}, { select: 'product brand category price img filename' });

    if (!productBefore) {
      // Eliminar archivo (error)
      if (req.file && req.file.path) {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
      return res.json({ update: false, message: 'Producto no encontrado' });
    }
  
    const productAfterTemp = {
      product: product || productBefore.product,
      brand: brand || productBefore.brand,
      category: category || productBefore.category,
      price: price || productBefore.price,    
      filename: productBefore.filename,
      img: productBefore.img,
    };
    
    if (req.file) {
      const { filename } = req.file;
      productAfterTemp.filename = filename;
      productAfterTemp.img = `${process.env.APP_HOST}:${process.env.APP_PORT}/public/${filename}`;

      // Llamar al path del proyecto
      const imagePath = path.join(__dirname, '../storage/img', productBefore.filename);

      if (fs.existsSync(imagePath)) {
        // Eliminar imagen del servidor
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ delete: false, message: 'Error interno del servidor'});
          }
        })
      }

    }    

    const productAfter = await productSchema.findByIdAndUpdate(
      id, productAfterTemp, { new: true, select: 'product brand category price img filename' }
    );

    return res.json({ update: true, product_old: productBefore, product_new: productAfter, message: "Producto actualizado correctamente",});

  } catch (err) {
    console.error(err);
    return res.status(500).json({ update: false, message: 'Error interno del servidor' });
  }
  
}

productController.deleteProduct = async (req, res) => {

  try {

    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.json({ find: false, message: 'Producto no encontrado'});
    
    product = await productSchema.findById(id);
    response = await productSchema.deleteOne({ _id: id });

    if (response.deletedCount === 0) return res.json({ find: false, message: 'Producto no encontrado'});

    // Llamar al path del proyecto
    const imagePath = path.join(__dirname, '../storage/img', product.filename);

    // Eliminar imagen del servidor
    if (fs.existsSync(imagePath)) {
      // Eliminar imagen del servidor
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ delete: false, message: 'Error interno del servidor' });
        }
    
        // Resto de tu lógica después de eliminar la imagen
        return res.json({ delete: true, message: 'Imagen eliminada correctamente' });
      });
    }

    return res.json({ find: true, message: `Producto ${product.product} eliminado correctamente` });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ delete: false, message: 'Error interno del servidor'});
  }

}


module.exports = productController