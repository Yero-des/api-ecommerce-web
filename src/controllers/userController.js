const userSchema = require('../models/user');
const bcrypt = require('bcrypt');

const userController = {}

userController.listUser = async (req, res) => {

  try {
    const data = await userSchema.find({})
    return res.json(data);
  } catch (err) {    
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }

};

userController.registerUser = async (req, res) => {
 
  try {
    
    const { name, last_name, email, username, password, repeat_password} = req.body    
    const existingUser = await userSchema.findOne({ username: username });

    if (existingUser) {
      return res.json({ create: false, message: 'El nombre de usuario ya está en uso' });
    }

    if (password !== repeat_password) {
      return res.json({ create: false, message: 'Las contraseñas no coinciden'});      
    } 

    if (!/^(?=.*\d)/.test(password)) {
      return res.json({ create: false, message: 'Las contraseñas deben incluir al menos un número'})
    }

    if (!/^.{9,}$/.test(password)) {
      return res.json({ create: false, message: 'La contraseña debe tener 8 caracteres como minimo'})
    }


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

  } catch (err) {
    
    console.error(err);
    return res.json({ create: false, message: err });
  }

};

userController.loginUser = async (req, res) => {

  try {

    const { username, password } = req.params;

    const existingUser = await userSchema.findOne({ username: username });

    if (!existingUser) {
      return res.json({ login: false, message: "No se encontro el usuario" });      
    }

    // Comparar contraseñas
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return res.json({ login: false, admin: existingUser.admin, message: "La contraseña es incorrecta" })
    }
    
    return res.json({ login: true, user: existingUser.username, message: "Inicio de sesion correcto!" });      


  } catch (err) {
    console.error(err);
    return res.json({ login: false, message: err });
  }

};

userController.findUserByUsername = async (req, res) => {

  try {
    const { username } = req.params;
    const user = await userSchema.findOne({ username: username });

    if (!user) {
      return res.json({ found: false, message: 'Usuario no encontrado' });
    }

    return res.json({ found: true, user: user, message: "Usuario encontrado con exito!",});

  } catch (err) {
    console.error(err);
    return res.status(500).json({ found: false, message: 'Error interno del servidor' });
  }
}

userController.updateUser = async (req, res) => {

  try {
    const { username: usernameParameter } = req.params;
    const { name, last_name, email, username, password } = req.body;    

    const userBefore = await userSchema.findOne(
      { username: usernameParameter }, {},
      { select: 'name last_name email username password'}
    );

    if (!userBefore) {
      return res.json({ update: false, message: 'Usuario no encontrado' });
    }
  
    const userAfterTemp = {
      name: name || userBefore.name, 
      last_name: last_name || userBefore.last_name,
      email: email || userBefore.email,
      username: username || userBefore.username, 
      password: userBefore.password
    };
    
    if (password) {
      const hashed = await bcrypt.hash(password, 10);    
      userAfterTemp.password = hashed;
    }

    const userAfter = await userSchema.findOneAndUpdate(
      { username: usernameParameter }, userAfterTemp,
      { new: true, select: 'name last_name email username password'}
    );

    return res.json({ update: true, user_old: userBefore, user_new: userAfter, message: "Usuario actualizado correctamente",});

  }  catch (err) {
    console.error(err);
    return res.status(500).json({ update: false, message: 'Error interno del servidor' });
  }
  
}

userController.removeUser = async (req, res) => {

  try {

    const { username } = req.params;
    response = await userSchema.deleteOne({ username: username });

    if (response.deletedCount === 0) {
      return res.json({ delete: false, message: `Usuario no encontrado` })
    }

    return res.json({ delete: true, message: `Usuario ${username} eliminado correctamente!` })

  } catch (err) {
    return res.json({ delete: false, message: 'Error interno del servidor'});
  }

}

module.exports = userController;