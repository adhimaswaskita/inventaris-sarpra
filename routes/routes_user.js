const express = require('express');
const router_user = express();
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const pool = require('../config/db');

router_user.post('/register', (req, res, next)=>{

    function generateId(email) {
        var randomAngka = [1,2,3,4,5,6,7,8,9,0];
        let data = [];
    
        let nVarr = email.split("_");
        let nVarr2 = nVarr[0].split("");
        let nVarr3 = nVarr[2].split("@");

        for (let i = 0 ; i < nVarr2.length;i++ ) {
            if(nVarr2[i] == 'a' || nVarr2[i] == 'i' || nVarr2[i] == 'u' || nVarr2[i] == 'e' || nVarr2[i] == 'o') {
                nVarr2.splice(i, 1);
            }
        }
        for (var i = 0; i < 3; i++) {
           let str2 = randomAngka[parseInt(Math.random() * (randomAngka.length))];
           data.push(str2) 
        }
        let hasil2 = data.join("");
        var hasil1 = nVarr2.join("").toUpperCase();
        let hasil3 = nVarr3[0].toUpperCase();

        return(hasil1 + hasil2 + hasil3)
    }

    const {nama, email, password, konfirmasi, no_telp} = req.body;
    const role = 'pengguna';
    const id_pengguna = generateId(email);

    if (password == konfirmasi) {
        bcrypt.hash(password, 10, (err, hash)=>{
            try {
                if(err) {
                    throw err;
                }
                else {
                    JSON.stringify(pool.query(`SELECT * FROM pengguna WHERE email = '${email}'`, (err, result)=>{
                        if(result.rows[0]) {
                            res.status(409).json({
                                status : 409,
                                message : `Email '${email}' telah terpakai`
                            })
                        }
                        else {
                            pool.query('INSERT INTO pengguna (id_pengguna, nama, email, password, role, no_telp ) VALUES ($1, $2, $3, $4, $5, $6)', [id_pengguna, nama, email, hash, role, no_telp], (error, result)=>{
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
    } else {
        res.status(400).json({
            code : 400,
            message : "Konfirmasi password salah"
        })
    }
})

router_user.post('/login', (req, res,next)=>{
    const {email} = req.body;

    pool.query(`SELECT * FROM pengguna WHERE email = '${email}'`)
    .then((data)=>{
        const {password} = req.body;

        const user = data.rows;
        
        if(user.length == 0) {
            res.status(401).send({
                code : 401,
                message : "email atau password salah"
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
                        const user_login = specifiedUser.email;

                        var token = JWT.sign({specifiedUser}, 's3cr3tphr4s3', {
                            expiresIn: '10h'
                        })

                        res.status(200).json({
                            code : 200,
                            message : `Berhasil login ke user ${user_login}`,
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