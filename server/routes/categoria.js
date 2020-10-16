const express = require('express')

let { verificaToken, verificaAdmin_Role } = require('../middlewares/auth');

let app = express();

let Categoria = require('../models/categoria');


//=======================
// CREATE CATEGORIA
//=======================

app.post('/categoria', verificaToken, (req, res) => {

    let descripcion = req.body.descripcion;
    let usuario = req.usuario;

    let categoria = new Categoria({
        descripcion, 
        usuario
    });

    categoria.save( (err, categoriaDB ) =>{

        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoriaDB ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });
    });

});

//=======================
// READ TODAS CATEGORIAS
//=======================

app.get('/categorias', verificaToken, (req, res) => { 

    Categoria.find({}, 'descripcion usuario estado')
            .sort('descripcion')
            .populate('usuario', 'nombre email')
            .exec( (err, categorias) => {
                if( err ){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                Categoria.countDocuments({}, (err, cont) => {
                    res.json({
                        ok: true,
                        categorias,
                        cont
                    });
                });
            });
});


//=======================
// READ CATEGORIA POR ID
//=======================

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


//=======================
// UPDATE CATEGORIA
//=======================

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, { descripcion: body.descripcion }, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//=======================
// DELETE CATEGORIA
//=======================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndUpdate(id, {estado: false}, {new: true}, (err, categoriaBorrada) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if( categoriaBorrada === null ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada,
            message: 'Categoría borrada'
        })
    });
});

module.exports = app;