import {Schema, model} from 'mongoose';

const imgs = new Schema({
    nombre : {type:String, required:true},
    ruta: {type:String, require:true, unique:true, index:true},
    tamano: {type:Number, require:true, index:true},
    pkusuario: {type:String, require:true, index:true},
});
const img = model('Img', imgs);
export default img;