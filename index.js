const express = require('express');
const bp = require('body-parser');
const router = require('./routes')
const router_user = require('./routes_user')

const app = express();
const port = 3000;

app.use(bp.json());
app.use(
    bp.urlencoded({
        extended:true
    })
)

app.use('/api', router);
app.use('/user', router_user);

app.use((err,req,res,next)=>{
    res.status(422).json({err: err.message})
})

app.listen(port, ()=>{
    console.log(`app running on port ${port}`)
})