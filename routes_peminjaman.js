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
    // const {nama_user} = req.body;
    // const user_capitalize = nama_user.replace(/\b\w/g, (satu)=> {
    //     return satu.toUpperCase();
    // })
    // console.log(nama_user + " || " + user_capitalize)

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

router_peminjaman.post('/tambah_data', (req, res, next)=>{
    const {waktu_peminjaman, waktu_pengembalian, penanggung, status_peminjaman, keterangan, lokasi_peminjaman, id_user, telp_peminjam, id_barang, nama_peminjam, jumlah} = req.body;

    if(id_barang > 0){

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
                console.log(result);
            } catch(err) {
                next(err)
            }
        })

    }

    else if (id_barang != true && id_barang != null) {

        let id_barangArr = [];
        const limit_barang = [1,1,1,1,1,1];

        id_barang.map((result)=>{
            id_barangArr.push(result);
        })

        for (let i = 0; i < id_barangArr.length; i++) {

            if (id_barangArr.length < limit_barang.length) {
                if (id_barangArr[i] == id_barangArr[0]) {
                    pool.query(`INSERT INTO peminjaman (waktu_peminjaman, waktu_pengembalian, penanggung, status_peminjaman, keterangan, lokasi_peminjaman, id_user, nama_peminjam, telp_peminjam,  id_barang, jumlah)
                    VALUES ('${waktu_peminjaman}', '${waktu_pengembalian}', '${penanggung}', '${status_peminjaman}', '${keterangan}', '${lokasi_peminjaman}',  '${id_user}', '${nama_peminjam}', '${telp_peminjam}', '${id_barangArr[0]}', '${jumlah}' )
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
                            console.log(result.rowCount);
                        } catch(err) {
                            next(err)
                        }
                    })
                }
                else if (id_barangArr[i] == id_barangArr[1]) {
                    pool.query(`INSERT INTO peminjaman (waktu_peminjaman, waktu_pengembalian, penanggung, status_peminjaman, keterangan, lokasi_peminjaman, id_user, telp_peminjam,  id_barang, jumlah)
                    VALUES ('${waktu_peminjaman}', '${waktu_pengembalian}', '${penanggung}', '${status_peminjaman}', '${keterangan}', '${lokasi_peminjaman}',  '${id_user}', '${telp_peminjam}', '${id_barangArr[1]}', '${jumlah}' )
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
                            console.log(result.rowCount);
                        } catch(err) {
                            next(err)
                        }
                    })
                }
                else if (id_barangArr[i] == id_barangArr[2]) {
                    pool.query(`INSERT INTO peminjaman (waktu_peminjaman, waktu_pengembalian, penanggung, status_peminjaman, keterangan, lokasi_peminjaman, id_user, telp_peminjam,  id_barang, jumlah)
                    VALUES ('${waktu_peminjaman}', '${waktu_pengembalian}', '${penanggung}', '${status_peminjaman}', '${keterangan}', '${lokasi_peminjaman}',  '${id_user}', '${telp_peminjam}', '${id_barangArr[2]}', '${jumlah}' )
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
                            console.log(result.rowCount);
                        } catch(err) {
                            next(err)
                        }
                    })
                }
                else if (id_barangArr[i] == id_barangArr[3]) {
                    pool.query(`INSERT INTO peminjaman (waktu_peminjaman, waktu_pengembalian, penanggung, status_peminjaman, keterangan, lokasi_peminjaman, id_user, telp_peminjam,  id_barang, jumlah)
                    VALUES ('${waktu_peminjaman}', '${waktu_pengembalian}', '${penanggung}', '${status_peminjaman}', '${keterangan}', '${lokasi_peminjaman}',  '${id_user}', '${telp_peminjam}', '${id_barangArr[3]}', '${jumlah}' )
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
                            console.log(result.rowCount);
                        } catch(err) {
                            next(err)
                        }
                    })
                }
                else if (id_barangArr[i] == id_barangArr[4]) {
                    pool.query(`INSERT INTO peminjaman (waktu_peminjaman, waktu_pengembalian, penanggung, status_peminjaman, keterangan, lokasi_peminjaman, id_user, telp_peminjam,  id_barang, jumlah)
                    VALUES ('${waktu_peminjaman}', '${waktu_pengembalian}', '${penanggung}', '${status_peminjaman}', '${keterangan}', '${lokasi_peminjaman}',  '${id_user}', '${telp_peminjam}', '${id_barangArr[4]}', '${jumlah}' )
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
                            console.log(result.rowCount);
                        } catch(err) {
                            next(err)
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
                message : "id_barang belum terisi"
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