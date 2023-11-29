const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.post('/users', (req, res) => {
  userController.listUser(req, res);
});

router.post('/users/create', (req, res) => {
  userController.registerUser(req, res);
});

router.post('/users/login', (req, res) => {
  userController.loginUser(req, res);
});


// router.post('/users/:id', (req, res) => {
//   userController.findUserById(req, res);
// });

// router.put('/users/:id', (req, res) => {
//   userController.updateUser(req, res);
// })

// router.delete('/users/:id', (req, res) => {
//   userController.removeUser(req, res);
// })

module.exports = router;