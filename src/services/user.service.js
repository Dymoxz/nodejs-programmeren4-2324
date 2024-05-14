const database = require('../dao/mysql-db')
const logger = require('../util/logger')

const userService = {
    create: (user, callback) => {
        logger.info('create user', user);

        const { firstName, lastName, emailAdress, password } = user;

        // Check if the email address already exists
        database.getConnection(function (err, connection) {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }

            connection.query(
                'SELECT * FROM user WHERE emailAdress = ?',
                [emailAdress],
                function (error, results, fields) {
                    connection.release();

                    if (error) {
                        logger.error('Error checking duplicate email:', error.message || 'unknown error');
                        callback(error, null);
                    } else {
                        // If the email already exists, return an error with status 400
                        if (results.length > 0) {
                            const duplicateError = new Error('User with this email address already exists');
                            logger.error(duplicateError.message);
                            callback({
                                status: 400,
                                message: 'User already exists.',
                                data: {}
                            }, null);
                        } else {
                            // If the email is unique, proceed with user creation
                            const sql = `INSERT INTO user (firstName, lastName, emailAdress, password) VALUES (?, ?, ?, ?)`;
                            const values = [firstName, lastName, emailAdress, password];

                            database.getConnection(function (err, connection) {
                                if (err) {
                                    logger.error(err);
                                    callback(err, null);
                                    return;
                                }

                                connection.query(sql, values, function (error, results, fields) {
                                    connection.release();

                                    if (error) {
                                        logger.error('error creating user:', error.message || 'unknown error');
                                        callback(error, null);
                                    } else {
                                        logger.trace('User created.');
                                        // Include the firstName in the response
                                        callback(null, {
                                            message: 'User created.',
                                            data: {
                                                firstName: firstName, // Include the firstName property
                                                lastName: lastName,
                                                emailAdress: emailAdress,
                                                id: results.insertId // Assuming id is returned after insertion
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    }
                }
            );
        });
    },





    getAll: (isActive, field2, callback) => {
        logger.info('getAll');

        // Construct the query with optional filters
        let query = 'SELECT * FROM `user`';
        let queryParams = [];

        if (isActive || field2) {
            query += ' WHERE';
            if (isActive) {
                query += ' isActive = ?';
                queryParams.push(isActive);
            }
            if (field2) {
                if (isActive) query += ' AND';
                query += ' field2 = ?';
                queryParams.push(field2);
            }
        }

        database.getConnection(function (err, connection) {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }

            connection.query(query, queryParams, function (error, results, fields) {
                connection.release();

                if (error) {
                    logger.error(error);
                    callback(error, null);
                } else {
                    logger.debug(results);
                    callback(null, {
                        message: `Found ${results.length} users.`,
                        data: results
                    });
                }
            });
        });
    },


    getById: (userId, creatorId, callback) => {
        logger.info('getById');
        database.getConnection(function (err, connection) {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }

            connection.query(
                'SELECT id, emailAdress, firstName, lastName, phoneNumber, password FROM `user` WHERE id = ?',
                [userId],
                function (error, resultsUser, fields) {
                    connection.release();

                    if (error) {
                        logger.error(error);
                        callback(error, null);
                    } else {
                        logger.debug(resultsUser);
                        userId = parseInt(userId, 10);
                        creatorId = parseInt(creatorId, 10);
                        if (resultsUser && resultsUser.length > 0) {
                            if (userId !== creatorId) {
                                resultsUser[0].password = undefined;
                            }
                            connection.query(
                                'SELECT id, name, description FROM `meal` WHERE cookId = ?',
                                [userId],
                                function (error, resultsMeal, fields) {
                                    connection.release();

                                    if (error) {
                                        logger.error(error);
                                        callback(error, null);
                                    } else {
                                        logger.debug(resultsMeal);
                                        callback(null, {
                                            message: `Found ${resultsUser.length} user.`,
                                            data: [resultsUser, resultsMeal],
                                        });
                                    }
                                }
                            );
                        } else {
                            const errorMessage = `User met ID ${userId} bestaat niet`;
                            const errorObject = new Error(errorMessage);
                            errorObject.status = 404;
                            callback(errorObject, null);
                        }
                    }
                }
            );
        });
    },

    update: (userId, user, callback) => {
        logger.info('update user', userId);

        const valuesToUpdate = [];
        const columnsToUpdate = Object.keys(user)
            .filter(key => user[key] !== undefined && user[key] !== null) // Filter out undefined or null values
            .map(key => {
                valuesToUpdate.push(user[key]);
                return `${key}=?`;
            });

        if (columnsToUpdate.length === 0) {
            // No fields to update
            callback(new Error('No fields to update'), null);
            return;
        }

        const setClause = columnsToUpdate.join(', ');
        const sql = `UPDATE user SET ${setClause} WHERE id = ?`;

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }

            const values = [...valuesToUpdate, userId];

            connection.query(
                sql,
                values,
                function (error, results, fields) {
                    connection.release();

                    if (error) {
                        logger.error('Error updating user:', error.message || 'unknown error');
                        callback(error, null);
                    } else {
                        logger.trace(`User updated with id ${userId}.`);
                        callback(null, {
                            message: `User updated with id ${userId}.`,
                            data: results
                        });
                    }
                }
            );
        });
    },

    delete: (userId, callback) => {
        logger.info('delete user', userId)
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'DELETE FROM `user` WHERE id = ?',
                id = userId,
                function (error, results, fields) {
                    connection.release()

                    if (err) {
                        logger.info(
                            'error deleting user: ',
                            err.message || 'unknown error'
                        )
                        callback(err, null)
                    } else {
                        logger.trace(`User deleted with id ${userId}.`)
                        callback(null, {
                            message: `User deleted with id ${userId}.`,
                            data: results
                        })
                    }
                }
            )
        })
    },

    getProfile: (userId, callback) => {
        logger.info('getProfile userId:', userId)

        database.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT id, firstName, lastName FROM `user` WHERE id = ?',
                [userId],
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        callback(null, {
                            message: `Found ${results.length} user.`,
                            data: results
                        })
                    }
                }
            )
        })
    }



}

module.exports = userService
