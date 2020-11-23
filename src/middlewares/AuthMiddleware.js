const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization) {
        return res.json({message: 'Token não encontrado'});
    }

    const parts = authorization.split(' ');

    
    if(parts.length !== 2) {
        return res.json({message: 'Erro de validação de acesso'})
    }

    const [ scheme, token ] = parts;

    if(!/^Bearer/i.test(scheme)) {
        return res.json({message: 'Erro de validação de acesso'});
    }

    jwt.verify(parts[1], process.env.SECRET, (err, decoded) => {
        if(err) {
            return res.json({message: 'Erro', error: err});
        }
        req.moderator = decoded.moderator;
        next();
    });
}