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
    const {nama_user} = req.body;
    const user_capitalize = nama_user.replace(/\b\w/g, (satu)=> {
        return satu.toUpperCase();
    })
    console.log(nama_user + " || " + user_capitalize)

    pool.query(`SELECT * FROM pengguna WHERE nama LIKE '%${user_capitalize}%'`, (error, result)=>{
        // console.log(result.rows[0].id_user)
        try{
            if(error){
                throw error
            }
            else if (result.rows.length > 0){
                res.status(200).json({
                    code : 200,
                    message : "User ditemukan",
                    data : result.rows
                })
            }
            else if (result.rows.length == 0) {
                res.status(404).json({
                    code : 404,
                    message : "User tidak ditemukan"
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
    const {username} = req.body;

    pool.query(`SELECT * FROM pengguna WHERE username = '${username}'`, (error, user)=>{
        
        if(error){
            throw error;
        }
        const {password} = req.body;

        const userPassword = user.rows;
        const specifiedUser = Object.assign(userPassword[0],{});
        const clearPassword = specifiedUser.password.replace(/\s/g,"");

        bcrypt.compare(password, clearPassword, (errorCompare, hasil)=>{

            if (errorCompare) {
                throw (errorCompare);
            }

            if (hasil){
                        try{
                        const data = user.rows;
                        const specified = Object.assign(data[0],{});
                        const hasil = specified.role.replace(/\s/g,"");
                        const user_login = specified.username.replace(/\s/g, "");
                        // console.log(specified.role);
                        res.status(200).json({
                            code : 200,
                            message : `Berhasil login ke user ${user_login}`,
                            data : specified 
                        })
                        } catch(errorCatch){
                            next(errorCatch)
                        }
            }
            else if (hasil == false){
                res.status(401).json({
                    code : 404,
                    message : "Unauthorized"
                })
            }
        })
    })
})

module.exports = router_user;