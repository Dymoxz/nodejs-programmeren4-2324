const assert = require('assert');
const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../util/config').secretkey;
const routes = require('express').Router();
const authController = require('../controllers/authentication.controller');
const logger = require('../util/logger');

function validateLogin(req, res, next) {
    try {
        if (!req.body.emailAdress) {
            throw new Error('missing emailAdress');
        }
        if (!req.body.password) {
            throw new Error('missing password');
        }
        if (typeof req.body.emailAdress !== 'string') {
            throw new Error('emailAdress must be a string');
        }
        if (typeof req.body.password !== 'string') {
            throw new Error('password must be a string');
        }
        next();
    } catch (ex) {
        res.status(400).json({
            status: 400,
            message: ex.message,
            data: {}
        });
    }
}

function validateToken(req, res, next) {
    logger.info('validateToken called');
    logger.trace('Headers:', req.headers);
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        logger.warn('Authorization header missing!');
        res.status(401).json({
            status: 401,
            message: 'Authorization header missing!',
            data: {}
        });
    } else {
        const token = authHeader.substring(7, authHeader.length);
        jwt.verify(token, jwtSecretKey, (err, payload) => {
            if (err) {
                logger.warn('Not authorized');
                res.status(401).json({
                    status: 401,
                    message: 'Not authorized!',
                    data: {}
                });
            }
            if (payload) {
                logger.debug('token is valid', payload);
                req.userId = payload.userId;
                next();
            }
        });
    }
}

routes.post('/login', validateLogin, authController.login);

module.exports = { routes, validateToken };
