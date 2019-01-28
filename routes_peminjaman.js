const express = require('express');
const router_peminjaman = express();
const pool = require('./queries');

router_peminjaman.get('/waktu_peminjaman', (req, res, next)=>{
    pool.query(`select pengguna.nama, peminjaman.waktu_peminjaman, peminjaman.waktu_pengembalian from pengguna inner join peminjaman ON pengguna.id_user = peminjaman.id_user;`, (error, result)=>{
        if(error) {
            throw error
        }
        else {
            try {
                res.status(200).json({
                    status : "OK",
                    code : 200,
                    message : "Data tersedia",
                    data : result.rows
                })
            } catch(err) {
                next (err)
            }
        }
    })
})

router_peminjaman.get('/pencarian', (req,res,next)=>{
    const {nama_user} = req.body;
    const user_capitalize = nama_user.replace(/\b\w/g, (satu)=> {
        return satu.toUpperCase();
    })
    // console.log(nama_user + " || " + user_capitalize)

    pool.query(`SELECT pengguna.nama, peminjaman.waktu_peminjaman, peminjaman.waktu_pengembalian FROM pengguna INNER JOIN peminjaman ON pengguna.id_user = peminjaman.id_user WHERE pengguna.nama LIKE '%${user_capitalize}%'`, (error, result)=>{ vvmc
        try{
            if(error){
                throw error
            }
            else if (result.rows.length > 0){
                res.status(200).json({
                    code : 200,
                    message : "Data ditemukan",
                    data : result.rows
                })
            }
            else if (result.rows.length == 0) {
                res.status(404).json({
                    code : 404,
                    message : "Data tidak ditemukan"
                })
            }
        }   catch (err){
            next (err);
            }
    })
})

router_peminjaman.post('/tambah_data', (req, res, next)=>{
    const {waktu_peminjaman, waktu_pengembalian, penanggung, status_peminjaman, keterangan, lokasi_peminjaman, id_user, telp_peminjam, id_barang, jumlah} = req.body;

    console.log(id_barang);

    pool.query(`INSERT INTO peminjaman (waktu_peminjaman, waktu_pengembalian, penanggung, status_peminjaman, keterangan, lokasi_peminjaman, id_user, telp_peminjam,  id_barang, jumlah)
        VALUES ('${waktu_peminjaman}', '${waktu_pengembalian}', '${penanggung}', '${status_peminjaman}', '${keterangan}', '${lokasi_peminjaman}',  '${id_user}', '${telp_peminjam}', '${id_barang}', '${jumlah}' )
    `, (error, result)=>{
        try{
            if(error){
                throw error
            }
            else {
                res.status(200).json({
                    code : 200,
                    message : "Berhasil tambah data",
                })
            }
            // console.log(result);
        } catch(err) {
            next(err)
        }
    })
})

router_peminjaman.delete('/delete_data', (req, res)=>{
    const {id_peminjaman} = req.body;

    pool.query(`DELETE FROM peminjaman WHERE id_peminjaman = ${id_peminjaman}`, (error, result)=>{
        if(error){
            throw (error)
        }
        else {
            res.status(200).json({
                code : 200,
                message : `Berhasil hapus data : '${id_peminjaman}'`
            })
        }
    } )
})

module.exports = router_peminjaman;