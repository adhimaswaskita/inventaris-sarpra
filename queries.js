const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host : 'localhost',
    database : 'learn',
    password : 'postgres',
    port : 5432
})

 module.exports = pool;