import {Schema, model} from 'mongoose';

const imgs = new Schema({
    nombre : {type:String, required:true, unique:false},
    ruta: {type:String, require:true, unique:false, index:true},
    tamano: {type:Number, require:true, unique:false ,index:true,},
    extension: {type:String, require:true, unique:false, index:true},
    pkusuario: {type:String, require:true, unique:false ,index:true},
});
const img = model('Img', imgs);
export default img;