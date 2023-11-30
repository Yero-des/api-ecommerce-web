const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.get('/users', (req, res) => {
  userController.listUser(req, res);
});

router.get('/users/:username', (req, res) => {
  userController.findUserByUsername(req, res);
})

router.post('/users/create', (req, res) => {
  userController.registerUser(req, res);
});

router.post('/users/login/:username/:password', (req, res) => {
  userController.loginUser(req, res);
});

router.put('/users/:username', (req, res) => {
  userController.updateUser(req, res);
})

router.delete('/users/:username', (req, res) => {
  userController.removeUser(req, res);
})

module.exports = router;