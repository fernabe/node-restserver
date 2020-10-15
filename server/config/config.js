// ====================================
//  Puerto
// ====================================
process.env.PORT = process.env.PORT || 3000


// ====================================
//  Entorno
// ====================================


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================================
// Vencimiento del token
// ====================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ====================================
// SEED de autenticación
// ====================================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ====================================
// DDBB
// ====================================

let urlDB;

if( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB;

// ====================================
// Google Client
// ====================================

process.env.CLIENT_ID = process.env.CLIENT_ID ||'832678320945-02c12h1r9s5584blsd3i87hq05bfn4mc.apps.googleusercontent.com'