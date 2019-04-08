const Pool = require('pg').Pool;
require('dotenv').config();
var db = process.env;

const pool = new Pool({
    user: db.DB_USER,
    host : db.DB_HOST,
    database : db.DATABASE,
    password : db.PASSWORD,
    port : db.DB_PORT
})

 module.exports = pool;