const express = require('express'),
      bp = require('body-parser'),
      router_kategori = require('./routes/routes_kategori'),
      router_user = require('./routes/routes_user'),
      router_peminjaman = require('./routes/routes_peminjaman'),
      router_barang = require('./routes/routes_barang'),
      router_detil = require('./routes/routes_detil_peminjaman');
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

app.use('/kategori', router_kategori);
app.use('/user', router_user);
app.use('/peminjaman', router_peminjaman);
app.use('/barang', router_barang);
app.use('/detil', router_detil)

app.use((err,req,res,next)=>{
    res.status(422).json({err: err.message})
})

app.listen(PORT, ()=>{
    console.log(`app running on port ${PORT}`)
})