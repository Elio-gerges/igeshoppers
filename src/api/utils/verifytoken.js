//Import libraries
const jwt = require('jsonwebtoken');

//Import Errors
const { tokenVerificationError, generalError } = require('../Messages/Errors');

module.exports = function (req, res, next) {
    const token = req.header('auth-token');
    if(!token) {
        res.status(401).send(new tokenVerificationError().getErrorMessage('Access Denied'));
    } else {
        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = verified;
            next();
        } catch (error) {
            res.status(401).send(new generalError().getErrorMessage({
                'type': error.message,
                'more': 'Kindly note that you are trying to access a secured website.\nAny attempt of fraud and security error will cause you a problem'
            }));
        }
    }
}