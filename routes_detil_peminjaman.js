const express = require('express');
const router_detil_peminjaman = express();
const pool = require('./queries');

router_detil_peminjaman.post('/insert', (req, res, next)=>{
    const {id_peminjaman, id_barang, jumlah} = req.body;

    pool.query(`INSERT INTO detil_peminjaman (id_peminjaman, id_barang, jumlah) VALUES ('${id_peminjaman}','${id_barang}', '${jumlah}')`, (error, result)=>{
        try {
            if(error) {
                throw error
            }
            else {
                res.status(200).json({
                    code : 200,
                    result : {
                        message : "Berhasil tambah data",
                        data : req.body
                    }
                })
            }
        } catch (err) {
            next (err)
        }
    })
})


router_detil_peminjaman.delete('/delete', (req, res, next)=>{
    const {id_detil_peminjaman} = req.body;

    pool.query(`DELETE FROM detil_peminjaman WHERE id_detil_peminjaman = '${id_detil_peminjaman}'`, (error, result)=>{
        try {
            if(error){
                throw error
            }
            else if (result.rowCount != 0){
                res.status(200).json({
                    code : 200,
                    message : 'berhasil hapus data'
                })
            }
            else if (result.rowCount == 0) {
                res.status(404).json({
                    code : 404,
                    message : "Data tidak ditemukan"
                })
            }
        } catch (err){
            next(err)
        }
    })
})

router_detil_peminjaman.get('/list', (req, res, next)=>{
    pool.query('SELECT * FROM detil_peminjaman', (error, result)=>{
        try {
            if(error){
                throw error
            }
            else if(result.rowCount != 0) {
                res.status(200).json({
                    code : 200,
                    message : "Berhasil ambil data",
                    data : result.rows
                })
            }
            else if(result.rowCount == 0) {
                res.status(404).json({
                    code : 404,
                    message : "Tidak ada data"
                })
            }
        } catch(err) {
            next(err)
        }
    })
})

module.exports = router_detil_peminjaman