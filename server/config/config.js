// ====================================
//  Puerto
// ====================================
process.env.PORT = process.env.PORT || 3000


// ====================================
//  Entorno
// ====================================


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ====================================
// DDBB
// ====================================

let urlDB;

if( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://adirest:y91XVLtBeEwRtjn4@cluster0.nievr.mongodb.net/cafe';
}

process.env.URLDB = urlDB;