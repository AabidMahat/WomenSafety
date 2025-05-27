const jwt = require('jsonwebtoken');

require('dotenv').config();

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(401).json({message: 'No token provided.'});

    jwt.verify(token, process.env.JWT_SECERT, (err, user) => {
        if(err) return res.status(403).json({message: 'Invalid token you got here -\o/-'});

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;