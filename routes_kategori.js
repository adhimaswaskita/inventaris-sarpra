const express = require('express');
const router_kategori = express();
const pool = require('./queries');

router_kategori.get('/get', (req, res)=>{
    pool.query('SELECT * FROM kategori', (err, result)=>{
        if(err) {
            throw err
        }
        res.status(200).send({
            status : 200,
            message : "Succes get data kategori",
            data : result.rows
        })
    })
})

router_kategori.post('/post', (req, res)=>{
    const {nama_kategori} = req.body;
    pool.query('INSERT INTO kategori (nama_kategori) VALUES ($1)',[nama_kategori], (err, result)=>{
        console.log(result);
        if(err) {
            throw err
        }
        res.status(200).send({
            status : 200,
            message : "Succes insert data kategori",
        })
    })
})

router_kategori.put('/put/:id_kategori', (req, res)=>{
    const {id_kategori} = req.params;
    const {nama_kategori} = req.body;
    pool.query('UPDATE kategori SET nama_kategori = $1 WHERE id_kategori = $2',[nama_kategori, id_kategori], (err, result)=>{
        if(err) {
            throw err
        }
        res.status(200).send({
            status : 200,
            message : "Succes update data kategori",
        })
    })
})

router_kategori.delete('/del/:id_kategori', (req, res)=>{
    const {id_kategori} = req.params;
    pool.query('DELETE FROM kategori WHERE id_kategori = $1',[id_kategori], (err, result)=>{
        if(err) {
            throw err
        }
        res.status(200).send({
            status : 200,
            message : "Succes delete data kategori",
        })
    })
})
module.exports = router_kategori;