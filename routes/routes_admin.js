const express = require('express');
const router_admin = express();
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const pool = require('../config/db');

router_admin.post('/register', (req, res, next)=>{

    function generateId(username) {
        var randomAngka = [1,2,3,4,5,6,7,8,9,0];
        let data = [];
    
        let nVarr = username.split("");

        for (let i = 0 ; i < nVarr.length;i++ ) {
            if(nVarr[i] == 'a' || nVarr[i] == 'i' || nVarr[i] == 'u' || nVarr[i] == 'e' || nVarr[i] == 'o') {
                nVarr.splice(i, 1);
            }
        }
        for (var i = 0; i < 7; i++) {
           let str2 = randomAngka[parseInt(Math.random() * (randomAngka.length))];
           data.push(str2) 
        }
        let hasil2 = data.join("");
        var hasil1 = nVarr.join("").toUpperCase();

        return(hasil1 + hasil2)
    }

    const {username, password, konfirmasi} = req.body;
    const role = 'admin';
    const id_pengguna = generateId(username);

    if (password == konfirmasi) {
        bcrypt.hash(password, 10, (err, hash)=>{
            try {
                if(err) {
                    throw err;
                }
                else {
                    JSON.stringify(pool.query(`SELECT * FROM admin WHERE username = '${username}'`, (err, result)=>{
                        if(result.rows[0]) {
                            res.status(409).json({
                                status : 409,
                                message : `Username '${username}' telah terpakai`
                            })
                        }
                        else {
                            pool.query('INSERT INTO admin (id_pengguna, username, password, role) VALUES ($1, $2, $3, $4)', [id_pengguna, username, hash, role], (error, result)=>{
                                if(error) {
                                    throw error
                                }
                                res.status(200).json({
                                    status : 200,
                                    message : `Berhasil tambah ${role} ${username}`,
                                })
                            })
                        }
                    }))
                }
            } catch (error) {
                next(error)
            }
        })
    } else {
        res.status(400).json({
            code : 400,
            message : "Konfirmasi password salah"
        })
    }
})

router_admin.post('/login', (req, res,next)=>{
    const {username} = req.body;

    pool.query(`SELECT * FROM admin WHERE username = '${username}'`)
    .then((data)=>{
        const {password} = req.body;

        const user = data.rows;
        
        if(user.length == 0) {
            res.status(401).send({
                code : 401,
                message : "username atau password salah"
            })
        }

        else {
        
            const specifiedUser = user[0];
            const userPassword = specifiedUser.password;
            
            bcrypt.compare(password, userPassword, (errorCompare, hasil)=>{

                if (errorCompare) {
                    throw (errorCompare);
                }

                if (hasil){
                        try{
                        const admin_login = specifiedUser.username;

                        var token = JWT.sign({specifiedUser}, 's3cr3tphr4s3', {
                            expiresIn: '10h'
                        })

                        res.status(200).json({
                            code : 200,
                            message : `Berhasil login ke user ${admin_login} sebagai admin`,
                            auth: true,
                            token : token,
                            data : specifiedUser
                        })

                        } catch(errorCatch){
                            next(errorCatch)
                        }
                }
                else if (hasil == false){
                    res.status(401).json({
                        code : 401,
                        message : "Unauthorized"
                    })
                }
            })
        }
    })
})

router_admin.get('/jwtverif', (req,res,next)=>{
    try {
        var token = req.headers['x-acces-token'];

        if(!token) {
            res.status(401).json({
                code : 401,
                message : 'No token provided'
            })
        }
        else {
            JWT.verify(token, 's3cr3tphr4s3',(err, decoded)=>{
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

router_admin.get('/logout', (req,res,next)=>{
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

module.exports = router_admin;