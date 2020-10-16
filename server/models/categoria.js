const mongoose = require('mongoose');
const usuario = require('./usuario');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: { 
        type: String,
        required: [true, 'El campo descripción es obligatorio'],
        unique: [true, 'Ya existe']
    },
    usuario: {
        type: Schema.Types.ObjectId, 
        ref: 'Usuario'
    },
    estado: { 
        type: Boolean, 
        default: true
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);