const jwt = require('jsonwebtoken');
const db = require('../dao/mysql-db');
const logger = require('../util/logger');
const jwtSecretKey = require('../util/config').secretkey;

const authService = {
    login: (userCredentials, callback) => {
        logger.debug('login');

        db.getConnection((err, connection) => {
            if (err) {
                logger.error(err);
                callback(err, null);
            }
            if (connection) {
                // 1. Check if the user account exists.
                connection.query(
                    'SELECT `id`, `emailAdress`, `password`, `firstName`, `lastName` FROM `user` WHERE `emailAdress` = ?',
                    [userCredentials.emailAdress],
                    (err, rows) => {
                        connection.release();
                        if (err) {
                            logger.error('Error: ', err.toString());
                            callback({ status: 500, message: err.message }, null);
                        } else if (rows && rows.length === 1) {
                            // 2. There was a result, check the password.
                            if (rows[0].password === userCredentials.password) {
                                logger.debug('Passwords DID match, sending userinfo and valid token');
                                const { password, ...userinfo } = rows[0];
                                const payload = { userId: userinfo.id };

                                jwt.sign(
                                    payload,
                                    jwtSecretKey,
                                    { expiresIn: '12d' },
                                    (err, token) => {
                                        if (err) {
                                            logger.error('Error: ', err.toString());
                                            callback({ status: 500, message: err.message }, null);
                                        } else {
                                            logger.info('User logged in, sending: ', userinfo);
                                            callback(null, {
                                                status: 200,
                                                message: 'User logged in',
                                                data: { ...userinfo, token }
                                            });
                                        }
                                    }
                                );
                            } else {
                                logger.debug('Password invalid');
                                callback({ status: 409, message: 'User not found or password invalid' }, null);
                            }
                        } else {
                            logger.debug('User not found');
                            callback({ status: 404, message: 'User not found' }, null);
                        }
                    }
                );
            }
        });
    }
};

module.exports = authService;
