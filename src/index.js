require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');

const app = express()
const port = process.env.PORT || 9000;

// Middleware
app.use(express.json());
app.use('/api', userRoutes)

// Conexion with MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error))

app.listen(port, () => console.log('server listening on port ', port));

