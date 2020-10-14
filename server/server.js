require('./config/config')

const express = require('express')
const mongoose = require('mongoose');

const app = express()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use( require('./routes/index'))

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.URLDB, (err, res) => {
    if( err ) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando peticiones en el puerto ${process.env.PORT}`);
});