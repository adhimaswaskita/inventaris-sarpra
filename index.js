const express = require('express');
const bp = require('body-parser');
const router = require('./routes')

const app = express();
const port = 3000;

app.use(bp.json());
app.use(
    bp.urlencoded({
        extended:true
    })
)

app.use('/api', router);

app.listen(port, ()=>{
    console.log(`app running on port ${port}`)
})