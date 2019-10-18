const jwt = require('jsonwebtoken');

const env = process.env;


const verify = (req, res, next) => {
    const token = req.header('auth-token');
    // Check token not null
    if (!token) {
        return res.status(401).send('Access Denied');
    }
    // Verify token
    try {
        const verified = jwt.verify(token, env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).send('Invalid access token, access denied');
    }

};


module.exports = verify;
