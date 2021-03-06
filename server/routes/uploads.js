const express = require('express')
const fileUpload = require('express-fileupload');
const usuario = require('../models/usuario');

const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
 app.use(fileUpload());


 app.put('/upload/:tipo/:id', function(req, res){

    let tipo = req.params.tipo;
    let id = req.params.id;

    if( !req.files ){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    //Validar tipo

    let tiposValidos = ['productos', 'usuarios'];
    if( tiposValidos.indexOf( tipo ) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: "Los tipo permitidos son " + tiposValidos.join(', '),
                tipo
            }
        });
    }

    let archivo = req.files.archivo;

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let nombreCortado= archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1]

    if( extensionesValidas.indexOf( extension) < 0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: "Extensión de archivo no válida. Se permiten archivos " + extensionesValidas.join(', '),
                extension
            }
        });
    }

    // Cambiar nombre archivo

    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv(`./uploads/${ tipo }/${ nombreArchivo }`,(err) => {
        if( err )
            return res.status(500).json({
                ok: false,
                err
            });
        
        if ( tipo === 'usuarios')
            imagenUsuario(id, res, nombreArchivo);
        if ( tipo === 'productos')
            imagenProducto(id, res, nombreArchivo);
    });
});


function imagenUsuario(id, res, nombreArchivo){
    
    Usuario.findById(id, (err, usuario) =>{
        if( err ){
            borraImagen(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }   
        if( !usuario ){
            borraImagen(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: true,
                err: {
                    message: "El usuario no existe"
                }
            })
        }

        borraImagen(usuario.img, 'usuarios');
        
        usuario.img = nombreArchivo;

        usuario.save( (err, usuarioGuardado) => {
            res.json({
                ok: true, 
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivo){

    Producto.findById(id, (err, producto) =>{
        if( err ){
            borraImagen(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }   
        if( !producto ){
            borraImagen(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: true,
                err: {
                    message: "El producto no existe"
                }
            })
        }

        borraImagen(producto.img, 'productos');
        
        producto.img = nombreArchivo;

        producto.save( (err, productoGuardado) => {
            res.json({
                ok: true, 
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });
}


function borraImagen(nombreImagen, tipo){
    let pathImg = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);

    if( fs.existsSync(pathImg) ){
        fs.unlinkSync(pathImg)
    }
}

module.exports = app