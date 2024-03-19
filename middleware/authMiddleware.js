const jwt = require('jsonwebtoken');
require('dotenv').config();
function verificarToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ status:401, message: 'Token de autenticação não fornecido' });
    }

    jwt.verify(token, process.env.MASTER_KEY, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ status:401, message: 'Token de autenticação expirado' });
            } else {
                return res.status(401).json({ status:401, message: 'Token de autenticação inválido' });
            }
        }

        const tokenExpiracao = decoded.exp * 1000; 
        const agora = Date.now();

        if (agora > tokenExpiracao) {
            return res.status(401).json({ status:401, message: 'Token de autenticação expirado' });
        }

        req.usuario = decoded;
        next();
    });
}

module.exports = verificarToken;
