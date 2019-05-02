let auth = module.exports = {};

auth.tokenVerify = function (req,res,next) {
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader != 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken

        next();
    }else {
        res.status(401).json({
            code : 401,
            message : 'Unauthorized'
        })
    }
}
