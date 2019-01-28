const express = require('express');
const router_barang = express();
const pool = require('./queries');

router_barang.get('/get', (req, res)=>{
    pool.query('SELECT * FROM barang', (err, result)=>{
        if(err) {
            throw err
        }
        res.status(200).send({
            status : 200,
            message : "Succes get data barang",
            data : result.rows
        })
    })
})

router_barang.get('/list', (req, res,next)=>{
    try {
        pool.query(`SELECT nama_barang FROM barang`, (error, result)=>{
            if(error){
                throw error
            }
            else {
                res.status(200).json({
                    code : 200,
                    message : "Data ditemukan",
                    data : result.rows
                })
            }
        })
    } catch(err){
        next(err)
    }
})

router_barang.get('/stock', (req, res, next)=>{
const {nama_barang} = req.body;

    try {
        var data1 = pool.query(`SELECT stok_barang FROM barang WHERE nama_barang = '${nama_barang}'`, (error, result)=>{
            
                    const JUMLAH_STOK = result.rows[0].stok_barang;
                
                    if(error){
                        throw error
                    }
                    else if (result.rowCount != 0) {
                        res.status(200).json({
                            code : 200,
                            message : "Berhasil dapat jumlah stok",
                            data : JUMLAH_STOK
                        })
                    }
                    else if(result.rowCount == 0) {
                        res.status(404).json({
                            code : 404,
                            message : "Tidak ada data"
                        })
                    }
                    return JUMLAH_STOK;
                })
        console.log(data1)
    } catch (err) {
        next(err)
    }
})


router_barang.get('/get/:nama_barang', (req, res)=>{
    const {nama_barang} =  req.params;
    pool.query(`SELECT * FROM barang WHERE nama_barang LIKE $1`,[nama_barang], (err, result)=>{
        if(err) {
            throw err
        }
        res.status(200).send({
            status : 200,
            message : "Succes get data barang by nama",
            data : result.rows
        })
    })
})

router_barang.get('/get/kategori/:nama_kategori', (req, res)=>{
    const {nama_kategori} =  req.params;
    pool.query(`SELECT id_barang, nama_barang, stok_barang, b.id_kategori, foto_barang, kode_barang FROM barang b LEFT JOIN kategori k ON b.id_kategori = k.id_kategori WHERE nama_kategori LIKE $1`,[nama_kategori], (err, result)=>{
        if(err) {
            throw err
        }
        res.status(200).send({
            status : 200,
            message : "Succes get data barang by kategori",
            data : result.rows
        })
    })
})

router_barang.post('/post', (req, res, next)=>{
    var nama_barang = req.body.nama_barang;
    var foto_barang = req.body.foto_barang;
    var stok_barang = req.body.stok_barang;
    var id_kategori = req.body.id_kategori;
    var kode_barang = req.body.kode_barang;
    pool.query(`INSERT INTO barang (nama_barang, foto_barang, stok_barang, id_kategori, kode_barang) VALUES ('${nama_barang}', '${foto_barang}', '${stok_barang}', '${id_kategori}', '${kode_barang}') `, (error, result)=>{
        try {
            if(error) {
                res.status(500).json({
                    code : 500,
                    message : error.detail
                })
            }
            res.status(200).send({
                status : 200,
                message : "Succes insert data barang"
            })
        } catch (err) {
            next(err)
        }
    })
})
router_barang.put('/put/:id_barang', (req, res)=>{
    const {id_barang} = req.params;
    var nama_barang = req.body.nama_barang;
    var stok_barang = req.body.stok_barang;
    var id_kategori = req.body.id_kategori;
    var foto_barang = req.body.foto_barang;
    var kode_barang = req.body.kode_barang;
    pool.query(`UPDATE barang SET nama_barang = '${nama_barang}', stok_barang =  ${stok_barang}, id_kategori = ${id_kategori}, foto_barang = bytea('${foto_barang}'), kode_barang = '${kode_barang}' WHERE id_barang = $1 `,[id_barang], (err, result)=>{
        if(err) {
            throw err
        }
        res.status(200).send({
            status : 200,
            message : "Succes update data barang"
        })
    })
})

router_barang.delete('/del/:id_barang', (req, res)=>{
    const {id_barang} = req.params;
    pool.query('DELETE FROM barang WHERE id_barang = $1',[id_barang], (err, result)=>{
        if(err) {
            throw err
        }
        res.status(200).send({
            status : 200,
            message : "Succes delete data barang"
        })
    })
})

module.exports = router_barang; 