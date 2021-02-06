//este es el archivo que va a realizar nuestra conexión a la base de datos.

const mongoose = require('mongoose');

// const DB_URL = 'mongodb://localhost:27017/academia'
const DB_URL = process.env.DB_URL;
//esto es lo que hay que poner para que funcione la conexión a la bd

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then ( ()=>{
    console.log("conectado a DDBB")
    })
    .catch (()=>{
    console.log("Error conecying ti DB");
    })

module.exports = DB_URL;