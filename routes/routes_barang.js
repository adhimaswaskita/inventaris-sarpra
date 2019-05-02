const express = require('express');
const router_barang = express();
const JWT = require('jsonwebtoken');
const pool = require('../config/db');
const auth = require('../config/auth');

router_barang.post('/tambah', auth.tokenVerify, (req, res, next)=>{
    function generate(idBarang) {
        
        var randomAngka = [1,2,3,4,5,6,7,8,9,0];
        let data = [];
        let data3 = [];
    
        let nVarr = idBarang.split(" ");
    
        let nVarr2 = nVarr[0].split("");
    
        if(nVarr.length > 1){
            let nVarr3 = nVarr[1].split("");
            for (let i = 0 ; i < nVarr2.length;i++ ) {
                if(nVarr2[i] == 'a' || nVarr2[i] == 'i' || nVarr2[i] == 'u' || nVarr2[i] == 'e' || nVarr2[i] == 'o') {
                    nVarr2.splice(i, 1);
                }
            }
            var hasil1 = nVarr2.join("").toUpperCase();
        
            for(var i = 0; i < 3; i++) {
               let str2 = randomAngka[parseInt(Math.random() * (randomAngka.length))];
               data.push(str2) 
            }
            let hasil2 = data.join("");
        
            for (let i = 0 ; i < nVarr3.length;i++ ) {
                if(nVarr3[i] == 'a' || nVarr3[i] == 'i' || nVarr3[i] == 'u' || nVarr3[i] == 'e' || nVarr3[i] == 'o') {
                    nVarr3.splice(i, 1);
                }
            }
            var hasil3 = nVarr3.join("").toUpperCase();
        
             for(var i = 0; i < 2; i++) {
                let str4 = randomAngka[parseInt(Math.random() * (randomAngka.length))];
                data3.push(str4) 
             }
             let hasil4 = data3.join("");
            return (hasil1 + hasil2 + hasil3 + hasil4)
        } 
        else if (nVarr.length == 1) {
            for (let i = 0 ; i < nVarr2.length;i++ ) {
                if(nVarr2[i] == 'a' || nVarr2[i] == 'i' || nVarr2[i] == 'u' || nVarr2[i] == 'e' || nVarr2[i] == 'o') {
                    nVarr2.splice(i, 1);
                }
            }
            for (var i = 0; i < 5; i++) {
               let str2 = randomAngka[parseInt(Math.random() * (randomAngka.length))];
               data.push(str2) 
            }
            let hasil2 = data.join("");
            var hasil1 = nVarr2.join("").toUpperCase();
            return(hasil1 + hasil2)
        }
    }   
    
    var nama_barang = req.body.nama_barang;
    var id_barang = generate(nama_barang);
    var stok_barang = req.body.stok_barang;
    var kategori = req.body.kategori;
    var kode_barang = req.body.kode_barang;

    JWT.verify(req.token, 's3cr3tphr4s3', (err, authData)=>{
        if(err) {
            res.status(401).json({
                code : 401,
                message : 'invalid token'
            })
        } else if (authData.specifiedUser.role != "admin") {
            res.status(403).json({
                code : 403,
                message : "forbidden"
            })
        } else {
        pool.query(`INSERT INTO barang (id_barang, nama_barang,  stok_barang, kategori, kode_barang) VALUES ('${id_barang}','${nama_barang}', '${stok_barang}', '${kategori}', '${kode_barang}')`)
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

router_barang.get('/list', (req,res,next)=>{
    pool.query('SELECT * FROM barang;').then((result)=>{
        res.status(200).json({
            data : result.rows
        })
    }).catch((err)=>{
        next(err)
    })
})

router_barang.delete('/delete/:id_barang', (req, res,next)=>{
    const {id_barang} = req.params;
    pool.query(`DELETE FROM barang WHERE id_barang = ${id_barang}`)
    .then((result)=>{
        res.status(200).json({
            code :200,
            message : "berhasil hapus data"
        })
    }).catch((err)=>{
        next(err)
    })
})



module.exports = router_barang; 