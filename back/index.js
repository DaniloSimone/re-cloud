import express from 'express'; 
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import usuarioModel from './schemas/usuarios.js';
import imgModel from './schemas/img.js'
import multer from 'multer';
import {dirname, extname, join} from 'path';
import { fileURLToPath } from 'url';
import usuario from './schemas/usuarios.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
dotenv.config()
const direccion = dirname(fileURLToPath(import.meta.url))
let conex = process.env.MONGOURL
mongoose.connect(conex+"prueba").then(connect=>{
    console.log("Conectado a la bd")
}).catch(err=>{
    console.log(err)
});

const app = express();

const multers = multer({
  storage: multer.diskStorage({
    destination:  join(direccion,'./archivos'),
    filename: (req,file,cb) =>{
      const extension = extname(file.originalname);
      const nombre = file.originalname.split(extension)[0];
      cb(null,`${nombre}-${Date.now()}${extension}`)
    },
  }),
  limits:{
    fieldSize: 10000000000000,
  }
})


app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.post("/register", async(req, res)=>{
    
    let body = req.body
    console.log(body)
    
    let busqueda = await usuarioModel.findOne({
      mail: body.mail
  });
  if(busqueda){
    res.status(404).send("El usuario ya existe")
    return
  }else{
    bcrypt.hash(body.contrasena, 10, function(err, hash) {
      let usuario = new usuarioModel ({
        nombre:body.nombre,
        mail:body.mail,
        contrasena:hash,
    })
    usuario.save()
    let token = jwt.sign(usuario, 'pol243');
    res.send(token)
    
  });
    
  }
})


app.post("/upload",multers.single("file"), (req,res)=>{
  const archivo = req.file
  const extension = extname(archivo.originalname);
  const nombre = archivo.originalname.split(extension)[0];
  let guardar = new imgModel({
    nombre: archivo.originalname,
    ruta: archivo.path,
    tamano: archivo.size,
    pkusuario: "1",
  })
  guardar.save()
  res.send("Guardado correctamente")
})
app.post("/buscar", async(req,res)=>{
  let busqueda = await imgModel.find({
    pkusuario: "1"
  })
  res.send(busqueda)
})
app.post("/login", async (req, res)=>{
    let body = req.body
    let busqueda = await usuarioModel.findOne({
        mail: body.mail,
    });
    if(busqueda){
      bcrypt.compare(body.contrasena, busqueda.contrasena, function(err, result) {
        if(result){
          let token = jwt.sign(body, 'pol243');
          res.send({token});
        }else{
          res.status(401).send("No se encontro el usuario")
        }
    });
    return
    }else{
      res.status(404).send("No se encontro el usuario")
    }
})
app.listen(3000,()=>{
    console.log("Servidor funcionando en puerto 3000");
})