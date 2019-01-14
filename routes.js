const express = require('express');
const router = express.Router();
const pool = require('./queries')

router.get('/get/kategori', (req, res)=>{
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

router.get('/get/kategori/:nama_kategori', (req, res)=>{
    const {nama_kategori} = req.params;

    pool.query('SELECT * FROM kategori WHERE nama_kategori = $1', [nama_kategori], (err, result)=>{
        if(err){
            throw err
        }
        console.log(result);
        res.status(200).json({
            status : 200,
            message : "Data found",
            data : result.rows
        })
    })
})

router.post('/post/kategori', (req, res)=>{
    const {nama_kategori} = req.body;

    pool.query('INSERT INTO kategori (nama_kategori) VALUES ($1)', [nama_kategori], (err, result)=>{
        if(err) {
            throw err;
        }
        res.status(201).json({
            status : 201,
            message : `kategori ${nama_kategori} added`
        })
    })
});

router.put('/update/kategori/:id_kategori', (req, res)=>{
    const {id_kategori} = req.params;
    const {nama_kategori} = req.body;

    pool.query('UPDATE kategori SET nama_kategori = $1 WHERE id_kategori = $2', [nama_kategori, id_kategori], (err, result)=>{
        if(err) {
            throw err
        }
        res.status(200).json({
            status : 200,
            message : `kategori ${id_kategori} updated`
        })
    })
})

router.delete('/delete/kategori/:id_kategori', (req, res)=>{
    const {id_kategori} = req.params;
    pool.query('DELETE FROM kategori WHERE id_kategori = $1', [id_kategori], ()=>{
        console.log(id_kategori);
        res.status(200).json({
            status : 200,
            message : `Delete kategori by id ${id_kategori} succes`
        })
    })
})

module.exports = router;