const userSchema = require('../models/user');

const userController = {}

userController.listUser = (req, res) => {
  userSchema
    .find({})
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json({ message: error});        
    })
};

userController.createUser = (req, res) => {
 
  const user = userSchema(req.body);

  user
    .save()
    .then((data) => res.json(data))
    .catch((error) => {
      res.json({ message: error});
    })

};

userController.findUserById = (req, res) => {
  const { id } = req.params;

  userSchema
    .findById(id)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json({ message: error});        
    })

}

userController.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, age, email, password } = req.body;

  userUpdate = {
    name: name, 
    age: age, 
    email: email, 
    password: password
  }

  userSchema
    .updateOne({ _id: id }, {$set: userUpdate})
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json({ message: error});        
    })

}

userController.removeUser = (req, res) => {
  const { id } = req.params;

  userSchema
    .deleteOne({ _id: id})
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json({ message: error});        
    })
}

module.exports = userController;