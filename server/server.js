require('./config/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function (req, res) {
  res.json('get usuario');
});

app.post('/usuario', (req, res) => {
    let usuario = req.body;
    if(usuario.nombre === undefined){
        res.status(400).json({
            ok: false,
            message: 'El nombre es necesario'
        });
    }else{
        res.json({
            usuario
        });
    }
});
 
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', (req, res) => {
    res.json('delete usuario');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando peticiones en el puerto ${process.env.PORT}`);
});