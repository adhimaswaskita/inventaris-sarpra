const express = require('express');
const JWT = require('jsonwebtoken');

const router_peminjaman = express();

const pool = require('../config/db');
const auth = require('../config/auth');

router_peminjaman.post('/tambah', auth.tokenVerify, (req,res,next)=>{

    const {jumlah_barang, kelas, keterangan, penanggung_jawab, waktu_pinjam, waktu_kembali, id_barang} = req.body;
    const status = "pending";
    
    JWT.verify(req.token, 's3cr3tphr4s3', (err, authData)=>{

        const id_pengguna = authData.specifiedUser.id_pengguna;

        if(err) {
            res.status(401).json({
                code : 401,
                message : 'invalid token'
            })
        }
        else {
        pool.query(`INSERT INTO peminjaman (id_barang, jumlah_barang, kelas, keterangan, penanggung_jawab, waktu_pinjam, waktu_kembali, id_pengguna, status) 
                    VALUES ('${id_barang}', '${jumlah_barang}','${kelas}', '${keterangan}', '${penanggung_jawab}', '${waktu_pinjam}', '${waktu_kembali}', '${id_pengguna}', '${status}')`)
            .then((result)=>{
                res.status(200).json({
                    code : 200,
                    message : "berhasil insert data",
                    authData
                })
            }).catch((err)=>{
                next(err)
            })
        }
    })
})

router_peminjaman.get('/terbaru/:id_pengguna', auth.tokenVerify, (req,res,next)=>{

    const {id_pengguna} = req.params;

    JWT.verify(req.token, 's3cr3tphr4s3', (err, authData)=>{
        if(err) {
            res.status(401).json({
                code : 401,
                message : 'invalid token'
            })
        } else {
            pool.query(`SELECT barang.nama_barang, peminjaman.waktu_pinjam, 
                        peminjaman.status FROM peminjaman INNER JOIN barang ON 
                        peminjaman.id_barang = barang.id_barang WHERE id_pengguna = '${id_pengguna}'`)
            .then((result)=>{
                res.status(200).json({
                    code : 200,
                    message : "Berhasil get data",
                    data : result.rows.reverse()
                })
            }).catch((err)=>{
                next(err);
            })
        }
    })
})

router_peminjaman.get('/deadline/:id_pengguna', auth.tokenVerify, (req,res,next)=>{
    const {id_pengguna} = req.params;

    JWT.verify(req.token, 's3cr3tphr4s3', (err, authData)=>{
        if(err) {
            res.status(401).json({
                code :401,
                message : "Unauthorized"
            })
        } else {
            pool.query(`SELECT * FROM peminjaman WHERE id_pengguna = '${id_pengguna}'`)
                .then((data)=>{

                    let waktuKembali = [];
                    let jamKembali = [];
                    let lebihValid = [];

                    for (let i = 0; i < data.rows.length; i++) {

                        let kembali = data.rows[i].waktu_kembali;
                        let kembaliSplit = kembali.split("-");
                        let intKembali = parseInt(kembaliSplit[1]);

                        waktuKembali.push(intKembali);
                    }

                    const sortWaktuKembali = waktuKembali.sort((a,b)=>{return a -b});
                    
                    for (let i = 0; i < sortWaktuKembali.length; i++) {
                        jamKembali.push("Jam ke-" + sortWaktuKembali[i]);
                    }
                    
                    const iniValid = jamKembali.reduce((accumulator, currentV)=>{
                        let found = accumulator.find((cari)=>{
                            return cari == currentV
                        });
                        if(found) {
                            found + currentV
                        } else {
                            accumulator.push(currentV);
                        } return(accumulator);
                    }, [])


                    for (let i = 0; i < iniValid.length; i++) {
                        lebihValid.push(data.rows.filter((wk)=>{
                            return wk.waktu_kembali == iniValid[i]
                        }))
                    }

                    let hasil = [].concat.apply([], lebihValid);
                    res.status(200).json({
                        code : 200,
                        message : "Berhasil get data",
                        data : hasil
                    })
                })
        }
    })
})

router_peminjaman.get('/diterima/:id_pengguna', auth.tokenVerify, (req,res,next)=>{

    const {id_pengguna} = req.params;
    const status = 'diterima'

    JWT.verify(req.token, 's3cr3tphr4s3', (err, authData)=>{
        if(err) {
            res.status(401).json({
                code : 401,
                message : "Invalid token"
            })
        } else {
            pool.query(`SELECT * FROM peminjaman WHERE id_pengguna = '${id_pengguna}' AND status = '${status}'`)
            .then((data)=>{
                res.status(200).json({
                    code : 200,
                    message : "Berhasil get data",
                    data : data.rowCount

                })
            }).catch((err)=>{
                next(err)
            })
        }
    })
})

router_peminjaman.get('/ditolak/:id_pengguna', auth.tokenVerify, (req,res,next)=>{

    const {id_pengguna} = req.params;
    const status = 'ditolak'

    JWT.verify(req.token, 's3cr3tphr4s3', (err, authData)=>{
        if(err) {
            res.status(401).json({
                code : 401,
                message : "Invalid token"
            })
        } else {
            pool.query(`SELECT * FROM peminjaman WHERE id_pengguna = '${id_pengguna}' AND status = '${status}'`)
            .then((data)=>{
                res.status(200).json({
                    code : 200,
                    message : "Berhasil get data",
                    data : data.rowCount

                })
            }).catch((err)=>{
                next(err)
            })
        }
    })
})

router_peminjaman.get('/total/:id_pengguna', auth.tokenVerify, (req,res,next)=>{

    const {id_pengguna} = req.params;

    JWT.verify(req.token, 's3cr3tphr4s3', (err, authData)=>{
        if(err) {
            res.status(401).json({
                code : 401,
                message : "Invalid token"
            })
        } else {
            pool.query(`SELECT * FROM peminjaman WHERE id_pengguna = '${id_pengguna}'`)
            .then((data)=>{
                res.status(200).json({
                    code : 200,
                    message : "Berhasil get data",
                    data : data.rowCount

                })
            }).catch((err)=>{
                next(err)
            })
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

router_peminjaman.put('/update/terima/:id_peminjaman', auth.tokenVerify, (req,res,next)=>{
    const {id_peminjaman} = req.params;

    const status = "diterima";

    JWT.verify(req.token, 's3cr3tphr4s3', (err,authData)=>{
        if(err) {
            res.status(401).json({
                code : 401,
                message : "Invalid token"
            })
        } else if (authData.specifiedUser.role != "admin") {
            res.status(403).json({
                code : 403,
                message : "Forbidden"
            })
        } else {
            pool.query(`UPDATE peminjaman SET status = '${status}' WHERE  id_peminjaman = ${id_peminjaman}`)
            .then(()=>{
                res.status(200).json({
                    code : 200,
                    message : "Berhasil update status peminjaman menjadi diterima"
                })
            }).catch((err)=>{
                next(err)
            })
        }
    })
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