const productController = require('../controllers/productController');
const upload = require('../libs/storage');
const express = require('express');
const router = express.Router();

router.get('/products', (req, res) => {
  productController.listProducts(req, res);
});

router.get('/products/:id', (req, res) => {
  productController.findProductById(req, res);
})

router.post('/products/create', upload.single('img'), (req, res) => {
    productController.addProduct(req, res);
  }
);

router.put('/products/:id', upload.single('img'), (req, res) => {
  productController.updateProduct(req, res);
})

router.delete('/products/:id', (req, res) => {
  productController.deleteProduct(req, res);
})

module.exports = router;