const express = require("express");
const router = express.Router();
const carController = require('../controllers/carController')

router.post('/car/add', (req, res) => {
  carController.addToCart(req, res);
})

router.delete('/car/delete', (req, res) => {
  carController.removeToCart(req, res);
});

router.delete('/car/delete/all/:username', (req, res) => {
  carController.removeAllCart(req, res);
});

module.exports = router