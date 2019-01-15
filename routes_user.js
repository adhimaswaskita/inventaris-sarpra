const express = require('express');
const router_user = express();
const bcrypt = require('bcryptjs');
const pool = require('./queries');

router_user.post('/register', (req, res)=>{
    const {nama, username, password, telp_user, role} = req.body;

    bcrypt.hash(password, 10, (err, hash)=>{
        if(err) {
            throw err;
        }
        pool.query('INSERT INTO pengguna (nama, username, password, telp_user, role ) VALUES ($1, $2, $3, $4, $5)', [nama, username, hash, telp_user, role], (error, result)=>{
            if(error) {
                throw error
            }
            res.status(200).json({
                status : 200,
                message : `Berhasil tambah ${role} ${nama}`,
            })
        })
    })
})

router_user.get('/list', (req, res)=>{
    pool.query('SELECT * FROM pengguna', (err, result)=>{
        if(err){
            err
        }
        else {
            res.status(200).json({
                code : 200,
                message : "Berhasil tampilkan seluruh user",
                data : result.rows
            })
        }
    })
});

router_user.get('/search', (req,res,next)=>{
    const {nama_user} = req.body

    pool.query(`SELECT * FROM pengguna WHERE nama LIKE '%${nama_user}%'`, (error, result)=>{
        try{
            console.log(result.rows[0].id_user)
            if(error){
                throw error
            }
            else if (result.rows[0].id_user != null){
                res.status(200).json({
                    code : 200,
                    message : "Data ditemukan",
                    data : result.rows
                })
            }
            else if (result.rows[0].id_user == null) {
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

router_user.delete('/delete', (req, res)=>{
    const {id_user} = req.body;

    pool.query('DELETE FROM pengguna WHERE id_user = $1', [id_user], (err, result)=>{
        console.log(result);
        if(err){
            throw err
        }
        else {
            res.status(200).json({
                code : 200,
                message : `User dengan id_user : ${id_user} berhasil dihapus`,
                command : result.command
            })
        }
    })
})

router_user.post('/login', (req, res,next)=>{
    const {username, password} = req.body;
    
    // bcrypt.compare(password, hash, (error, hash)=>{
    //     if (error) {
    //         res.status(401).json({
    //             failed : "Unauthorized Acces"
    //         })
    //     }
    pool.query(`SELECT * FROM pengguna WHERE username='${username}' AND password= '${password}'`,  (err,result)=>{
        try{
            if (err) {
                res.status(401).json({
                    failed : "Unauthorized Acces"
                })
            }

            const data = result.rows;
            const specified = Object.assign(data[0],{})
            const userRole = specified.role.replace(/\s/g,"");
            // if (userRole.startsWith('user')){
            //     console.log("Selamat datang siswa");
            // }
            // else if(userRole.startsWith('admin')){
            //     console.log("Selamat datang admin");
            // }
            if (userRole == "user"){
                res.status(200).json({
                    code : 200,
                    status : userRole,
                    data : specified
                })
            }
            else if(userRole == 'admin'){
                res.status(200).json({
                    code : 200,
                    status : userRole,
                    data : specified
                })
            }} catch (err) {
                next (err);
            }
        })
})

module.exports = router_user;