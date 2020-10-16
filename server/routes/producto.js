const express = require('express');
const { restArgs } = require('underscore');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/auth');

let app = express();

let Producto = require('../models/producto');

 
//=======================
// CREATE PRODUCTO
//=======================

app.post('/producto', verificaToken, (req, res) => {

    let nombre = req.body.nombre; 
    let precioUni = req.body.precio;
    let categoria = req.body.categoria;
    let usuario = req.usuario._id;
    let descripcion = req.body.descripcion;

    let producto = new Producto({
        nombre,
        precioUni,
        usuario,
        categoria,
        descripcion
    });

    producto.save( (err, productoDB ) =>{

        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

//=======================
// READ TODOS PRODUCTOS
//=======================

app.get('/productos', verificaToken, (req, res) => {      

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10
    limite = Number(limite);

    Producto.find({disponible: true})
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .skip(desde)
            .limit(limite)
            .exec( (err, productos) => {
                if( err ){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                Producto.countDocuments({}, (err, cont) => {
                    res.json({
                        ok: true,
                        productos,
                        cont
                    });
                });
            });
});

//=======================
// READ PRODUCTO POR ID
//=======================

app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
    .populate('categoria', 'descripcion')
    .exec( (err, productoDB ) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoDB ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});


//=======================
// BUSCAR PRODUCTO
//=======================

app.get('productos/buscar/:termino', (req, res) =>{
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
        .populate('categoria', 'nombre')
        .exec( (err, producto) => {

            if( err )
            {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                producto
            });
        });
});

//=======================
// UPDATE PRODUCTO
//=======================

app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let fields_update = {
       nombre: body.nombre,
       precioUni: body.precio
    }

    let options = {
        new: true,
        runValidators: true
    }

    Producto.findByIdAndUpdate(id, fields_update, options, (err, productoDB) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoDB ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El producto no existe"
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//=======================
// DELETE PRODUCTO
//=======================

app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, {disponible: false}, {new: true}, (err, productoBorrado) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if( productoBorrado === null ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado,
            message: 'Producto borrado'
        })
    });
});

module.exports = app;
