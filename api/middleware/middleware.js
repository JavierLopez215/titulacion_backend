const jwt = require('jsonwebtoken');
const config = require('../../config/config');

// class Middleware {

// verificarToken(req, res, next) {
const verifyToken = (req, res, next) => {
    // if (!req.headers.authorization) return res.status(401).json('No autorizado'); 
    if (!req.headers.authorization) return res.status(401).send('Error token');
    // const token = req.headers.authorization.substr(7);
    const token = req.headers.authorization.split(' ')[1];
    // const token = req.headers.authorization;

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
