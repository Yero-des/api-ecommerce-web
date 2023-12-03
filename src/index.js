require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/car');
const path = require('path');

const app = express()
const port = 9000 || process.env.APP_PORT;

// Middleware
app.use(express.json());
app.use('/api', userRoutes)
app.use('/api', productRoutes)
app.use('/api', cartRoutes)
app.use('/public', express.static(path.join(__dirname, '/storage/img')));

// Conexion with MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error))

app.listen(port, () => console.log('server listening on port ', port));

