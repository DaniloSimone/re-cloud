import {Schema, model} from 'mongoose';

const usuarios = new Schema({
    nombre: {type:String, required:true},
    mail: {type:String, require:true, unique:true, index:true},
    contrasena: {type:String, require:true,index:true}




});
const usuario = model('Usuario', usuarios);
export default usuario;  