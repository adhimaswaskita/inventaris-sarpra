const express = require('express');
const router_user = express();
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const config = require('../config');
const pool = require('../queries');

router_user.post('/register', (req, res, next)=>{
    const {nama, username, password, telp_user, role} = req.body;

    bcrypt.hash(password, 10, (err, hash)=>{
        try {
            if(err) {
                throw err;
            }
            else {
                JSON.stringify(pool.query(`SELECT * FROM pengguna WHERE username = '${username}'`, (err, result)=>{
                    if(result.rows[0]) {
                        res.status(409).json({
                            status : 409,
                            message : `Username '${username}' telah terpakai`
                        })
                    }
                    else {
                        pool.query('INSERT INTO pengguna (nama, username, password, telp_user, role ) VALUES ($1, $2, $3, $4, $5)', [nama, username, hash, telp_user, role], (error, result)=>{
                            if(error) {
                                throw error
                            }
                            res.status(200).json({
                                status : 200,
                                message : `Berhasil tambah ${role} ${nama}`,
                            })
                        })
                    }
                }))
            }
        } catch (error) {
            next(error)
        }
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
        console.log(userPassword.length)
        
        if(userPassword.length == 0) {

            res.status(401).send({
                code : 401,
                message : "Username atau password salah"
            })
        }

        else {
        
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
                        
                        console.log(specified.id_user);

                        var token = JWT.sign({id_user : specified.id_user}, config.secret, {
                            expiresIn: 86400
                        })
                        res.status(200).json({
                            code : 200,
                            message : `Berhasil login ke user ${user_login}`,
                            auth: true,
                            token : token,
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
        }
    })
})

router_user.get('/jwtverif', (req,res,next)=>{
    try {
        var token = req.headers['x-acces-token'];

        if(!token) {
            res.status(401).json({
                code : 401,
                message : 'No token provided'
            })
        }
        else {
            JWT.verify(token, config.secret,(err, decoded)=>{
                if(err){
                    res.status(500).json({
                        code : 500,
                        message : 'Failed to authenticate token'
                    })
                }
                else {
                    res.status(200).json({
                        code : 200,
                        message : 'Succes authenticate token',
                        data : decoded
                    })
                }
            })
        }
    } catch (error) {
        next(error)
    }
})

router_user.get('/logout', (req,res,next)=>{
    console.log(req.isAuthenticated);
    req.logout();
    try {
        if (req.isAuthenticated == false) {
            res.status(200).json({
                code : 200,
                message : "Berhasil keluar",
                auth: true,
                token : null
            })
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router_user;