const express = require('express');
const bp = require('body-parser');
const router_kategori = require('./routes_kategori');
const router_user = require('./routes_user');
const router_peminjaman = require('./routes_peminjaman');
const router_barang = require('./routes_barang');
const router_detil = require('./routes_detil_peminjaman')

const app = express();
const port = 3000;

app.use(bp.json());
app.use(
    bp.urlencoded({
        extended:true
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

app.use('/kategori', router_kategori);
app.use('/user', router_user);
app.use('/peminjaman', (router_peminjaman));
app.use('/barang', router_barang);
app.use('/detil', router_detil)

app.use((err,req,res,next)=>{
    res.status(422).json({err: err.message})
})

app.listen(port, ()=>{
    console.log(`app running on port ${port}`)
})