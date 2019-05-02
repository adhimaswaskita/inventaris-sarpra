const express = require('express'),
      bp = require('body-parser'),
      router_user = require('./routes/routes_user'),
      router_admin = require('./routes/routes_admin'),
      router_peminjaman = require('./routes/routes_peminjaman'),
      router_barang = require('./routes/routes_barang');
      
      require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(bp.json());

app.use(
    bp.urlencoded({
        extended:false
    })
)

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.use('/user', router_user);
app.use('/admin', router_admin);
app.use('/peminjaman', router_peminjaman);
app.use('/barang', router_barang);


app.listen(PORT, ()=>{
    console.log(`app running on port ${PORT}`)
})