const userSchema = require('../models/user');
const bcrypt = require('bcrypt');

const userController = {}

userController.listUser = async (req, res) => {

  try {
    const data = await userSchema.find({})
    res.json(data);
  } catch (err) {
    res.json({ message: err });
  }

};

userController.registerUser = async (req, res) => {
 
  try {
    
    const { name, last_name, email, username, password, repeat_password} = req.body    

    if (password == repeat_password) {

      // Encriptar contraseña
      const hashed = await bcrypt.hash(password, 10);

      // Agregar nuevo usuario
      const user = userSchema({
        name: name, 
        last_name: last_name,
        email: email, 
        username: username,
        password: hashed.toString()
      });

      await user.save();

      return res.json({ create: true, message: "Nuevo usuario agregado!", user: user});
      
    } else {
      return res.json({ create: false, message: 'Las contraseñas no coinciden'});
    }

  } catch (err) {
    res.json({ create: false, message: err });
  }

};

userController.loginUser = async (req, res) => {

  try {

  } catch (err) {

  }

};

userController.findUserById = async (req, res) => {

  try {
    const { id } = req.params;
    const data = await userSchema.findById(id);
    res.json({
      message: "Se encontro al usuario con exito",
      data: data
    });
  } catch (err) {
    res.json({ message: err });
  }
}

userController.updateUser = async (req, res) => {

  try {
    const { id } = req.params;
    const { name, age, email, password } = req.body;
    
    const userAfterTemp = {
      name: name, 
      age: age, 
      email: email, 
      password: password
    };
    
    const userBefore = await userSchema.findById(id, {} ,{ select: 'name age email password'});
    const userAfter = await userSchema.findByIdAndUpdate(id, userAfterTemp, { new: true, select: 'name age email password'});

    res.json({
      message: "Usuario actualizado correctamente",
      data_antigua: userBefore,
      data_nueva: userAfter
    });

  } catch (err) {
    res.json({ message: err });
  }
  
}

userController.removeUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userSchema.deleteOne({ _id: id});
    res.json({
      message: `Usuario con el id ${id} ha sido eliminado`
    })

  } catch (err) {
    res.json({ message: err});
  }
}

module.exports = userController;