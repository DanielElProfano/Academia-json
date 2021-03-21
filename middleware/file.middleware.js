const multer = require('multer');
const path = require('path');
require('dotenv').config();
const fs = require('fs')
const cloudinary = require('cloudinary').v2;

const VALID_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

   const storage = multer.diskStorage({
        filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
        },
        destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'));
        }
    });
    const fileFilter = (req, file, cb) => {
        if (!VALID_FILE_TYPES.includes(file.mimetype)) {
        cb(new Error('Invalid file type'));
        } else {
        cb(null, true);
        }
    }
    
    const upload = multer({
        storage,
        fileFilter,
        limits: {
          fieldNameSize: 500,
          fieldSize: 500000000,
        },
      });

    const uploadImage = async(req, res, next) => {    
      if(req.file) {
        console.log(req.file);
          const filePath = req.file.path;
          const image = await cloudinary.uploader.upload(filePath);
          /**
           * Primero subimos la imagen a nuestro servidor con multer
           * Una vez subida, la enviamos a Cloudinary y este nos devuelve
           * la url de nuestra imagen. Cuando obtenemos la url, borramos
           * la imagen de nuestro servidor.
           */
          await fs.unlinkSync(filePath);
  
          req.file_url = image.secure_url;
  
          /**
           * Continuamos ejecutando nuestro controller
           */
          return next();
      } else {
          return next();
      }
  }
  
      

module.exports = { upload, uploadImage };