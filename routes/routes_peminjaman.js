const express = require('express');
const router_peminjaman = express();
const pool = require('../queries');

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

router_peminjaman.post('/pencarian', (req,res,next)=>{
    const {id_user} = req.body;

    pool.query(`SELECT pengguna.nama, peminjaman.waktu_peminjaman, peminjaman.waktu_pengembalian FROM pengguna INNER JOIN peminjaman ON pengguna.id_user = peminjaman.id_user WHERE pengguna.id_user = '${id_user}'`, (error, result)=>{
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

router_peminjaman.get('/list', (req, res, net)=>{
    try {
        pool.query(`SELECT * FROM peminjaman;`, (error, result)=>{
            if (result.rowCount != 0) {
                res.status(200).json({
                    code : 200,
                    message : "Data tersedia",
                    data : result.rows
                })
            }
            else {
                res.status(404).json({
                    code : 404,
                    message : "Data tidak tersedia"
                })
            }
        })
    } catch (err) {
        next (err)
    }
})

router_peminjaman.post('/update', (req,res,next)=>{
    var {id_peminjaman, status_peminjaman} = req.body;
    pool.query(`UPDATE peminjaman SET status_peminjaman = '${status_peminjaman}' WHERE  id_peminjaman = ${id_peminjaman}`, (err, result)=>{
        try {
            if(err){
                throw err
            }
            else {
                res.status(200).json({
                    code : 200, 
                    message : `berhasil ${status_peminjaman} peminjaman`
                })
            }
        } catch (err) {
            next()
        }
    })
})

router_peminjaman.post('/tambah_data', (req, res, next)=>{
    const {waktu_peminjaman, waktu_pengembalian, penanggung, status_peminjaman, keterangan, lokasi_peminjaman, id_user, telp_peminjam, id_barang, nama_peminjam, jumlah} = req.body;

    if(id_barang > 0){

        pool.query(`INSERT INTO peminjaman (waktu_peminjaman, waktu_pengembalian, penanggung, status_peminjaman, keterangan, lokasi_peminjaman, id_user, telp_peminjam,  id_barang, jumlah, nama_peminjam)
        VALUES ('${waktu_peminjaman}', '${waktu_pengembalian}', '${penanggung}', '${status_peminjaman}', '${keterangan}', '${lokasi_peminjaman}',  '${id_user}', '${telp_peminjam}', '${id_barang}', '${jumlah}', '${nama_peminjam}' )
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
                console.log(result);
            } catch(err) {
                next(err)
            }
        })

    }

    else if (id_barang != true && id_barang != null) {

        let id_barangArr = [];
        let jumlahArr = [];
        const limit_barang = [1,1,1,1,1,1];

        id_barang.map((result)=>{
            id_barangArr.push(result);
        })

        jumlah.map((result)=>{
            jumlahArr.push(result)
        })

        for (let i = 0; i < id_barangArr.length; i++) {
            if (id_barangArr.length < limit_barang.length) {
                if (id_barangArr[i] == id_barangArr[0] && jumlahArr[i] == jumlahArr[0]) {
                    pool.query(`INSERT INTO peminjaman (waktu_peminjaman, waktu_pengembalian, penanggung, status_peminjaman, keterangan, lokasi_peminjaman, id_user, nama_peminjam, telp_peminjam,  id_barang, jumlah)
                    VALUES ('${waktu_peminjaman}', '${waktu_pengembalian}', '${penanggung}', '${status_peminjaman}', '${keterangan}', '${lokasi_peminjaman}',  '${id_user}', '${nama_peminjam}', '${telp_peminjam}', '${id_barangArr[0]}', '${jumlahArr[0]}' )
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
                        } catch(err) {
                            next()
                        }
                    })
                }
                else if (id_barangArr[i] == id_barangArr[1]  && jumlahArr[i] == jumlahArr[1]) {
                    pool.query(`INSERT INTO peminjaman (waktu_peminjaman, waktu_pengembalian, penanggung, status_peminjaman, keterangan, lokasi_peminjaman, id_user,  nama_peminjam, telp_peminjam,  id_barang, jumlah)
                    VALUES ('${waktu_peminjaman}', '${waktu_pengembalian}', '${penanggung}', '${status_peminjaman}', '${keterangan}', '${lokasi_peminjaman}',  '${id_user}', '${nama_peminjam}', '${telp_peminjam}', '${id_barangArr[1]}', '${jumlahArr[1]}' )
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
                        } catch(err) {
                            next()
                        }
                    })
                }
                else if (id_barangArr[i] == id_barangArr[2]  && jumlahArr[i] == jumlahArr[2]) {
                    pool.query(`INSERT INTO peminjaman (waktu_peminjaman, waktu_pengembalian, penanggung, status_peminjaman, keterangan, lokasi_peminjaman, id_user,  nama_peminjam, telp_peminjam,  id_barang, jumlah)
                    VALUES ('${waktu_peminjaman}', '${waktu_pengembalian}', '${penanggung}', '${status_peminjaman}', '${keterangan}', '${lokasi_peminjaman}',  '${id_user}', '${nama_peminjam}', '${telp_peminjam}', '${id_barangArr[2]}', '${jumlahArr[2]}' )
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
                        } catch(err) {
                            next()
                        }
                    })
                }
                else if (id_barangArr[i] == id_barangArr[3] && jumlahArr[i] == jumlahArr[3]) {
                    pool.query(`INSERT INTO peminjaman (waktu_peminjaman, waktu_pengembalian, penanggung, status_peminjaman, keterangan, lokasi_peminjaman, id_user,  nama_peminjam, telp_peminjam,  id_barang, jumlah)
                    VALUES ('${waktu_peminjaman}', '${waktu_pengembalian}', '${penanggung}', '${status_peminjaman}', '${keterangan}', '${lokasi_peminjaman}',  '${id_user}', '${nama_peminjam}', '${telp_peminjam}', '${id_barangArr[3]}', '${jumlahArr[3]}' )
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
                        } catch(err) {
                            next()
                        }
                    })
                }
                else if (id_barangArr[i] == id_barangArr[4]  && jumlahArr[i] == jumlahArr[4]) {
                    pool.query(`INSERT INTO peminjaman (waktu_peminjaman, waktu_pengembalian, penanggung, status_peminjaman, keterangan, lokasi_peminjaman, id_user, nama_peminjam, telp_peminjam,  id_barang, jumlah)
                    VALUES ('${waktu_peminjaman}', '${waktu_pengembalian}', '${penanggung}', '${status_peminjaman}', '${keterangan}', '${lokasi_peminjaman}',  '${id_user}', '${nama_peminjam}', '${telp_peminjam}', '${id_barangArr[4]}', '${jumlahArr[4]}' )
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
                        } catch(err) {
                            next()
                        }
                    })
                }
            }
            else {
                try {
                    res.status(429).json({
                        code : 429,
                        message : "Data melebihi batas"
                    });
                } catch (err) {
                    next (err)
                }
            }
        }

    }
    else if (id_barang != true && id_barang == null) {
        try{
            res.status(400).json({
                code : 400,
                message : "barang belum terpilih"
            })
        } catch (err) {
            next (err)
        }
    }
})

router_peminjaman.delete('/delete_data', (req, res)=>{
    const {id_peminjaman} = req.body;

    pool.query(`DELETE FROM peminjaman WHERE id_peminjaman = ${id_peminjaman}`, (error, result)=>{
        if(error){
            throw (error)
        }if (result.rowCount != 0) {
            res.status(200).json({
                code : 200,
                message : "Data tersedia",
                data : result.rows
            })
        }
        else {
            res.status(404).json({
                code : 404,
                message : "Data tidak tersedia"
            })
        }
    } )
})

module.exports = router_peminjaman;