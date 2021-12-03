const jwt = require('jsonwebtoken');
const config = require('../../config/config');

// class Middleware {

// verificarToken(req, res, next) {
const verifyToken = (req, res, next) => {
    if (!req.headers.authorization) return res.status(401).send('Error token');
    const token = req.headers.authorization.split(' ')[1];

    if (token !== '') {
        try {
            const content = jwt.verify(token, config.SECRET_PASS);
            // console.log('Content:  ', content);
            req.data = content;
            next();
        } catch (error) {
            res.status(401).json({
                error: 'Token invalido'
            });
        }

    } else {
        res.status(401).json({
            error: 'Token vacio'
        });
    }
}

// }
// const middleware = new Middleware();
// module.exports = middleware;
 module.exports = verifyToken;
