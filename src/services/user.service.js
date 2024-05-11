const database = require('../dao/mysql-db')
const logger = require('../util/logger')

const userService = {
    create: (user, callback) => {
        logger.info('create user', user);

        database.getConnection(function (err, connection) {
            if (err) {
                logger.error(err);
                callback(err, null);
                return;
            }

            const { firstName, lastName, isActive, emailAddress, password, phoneNumber, roles, street, city } = user;

            connection.query(
                'INSERT INTO user (firstName, lastName, isActive, emailAddress, password, phoneNumber, roles, street, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [firstName, lastName, isActive, emailAddress, password, phoneNumber, roles, street, city],
                function (error, results, fields) {
                    connection.release();

                    if (error) {
                        logger.error('error creating user:', error.message || 'unknown error');
                        callback(error, null);
                    } else {
                        logger.trace('User created.');
                        callback(null, {
                            message: 'User created.',
                            data: results
                        });
                    }
                }
            );
        });
    },

    getAll: (callback) => {
        logger.info('getAll')
        database.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT * FROM `user`',
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        callback(null, {
                            message: `Found ${results.length} users.`,
                            data: results
                        })
                    }
                }
            )
        })
    },

    getById: (userId, callback) => {
        logger.info('getUserById', userId);
        database.getById(userId, (err, user) => {
            if (err) {
                logger.error('Error getting user by ID:', err.message || 'unknown error');
                callback(err, null);
            } else {
                if (!user) {
                    const error = {
                        status: 404,
                        message: 'User not found'
                    };
                    logger.error(error.message);
                    callback(error, null);
                } else {
                    logger.trace(`User found with ID ${userId}`);
                    callback(null, {
                        message: `User found with ID ${userId}`,
                        data: user
                    });
                }
            }
        });
    },

    update: (userId, updatedUserData, callback) => {
        logger.info('Updating user with ID:', userId);
        database.update(userId, updatedUserData, (err, updatedUser) => {
            if (err) {
                logger.error('Error updating user:', err.message || 'unknown error');
                callback(err, null);
            } else {
                logger.trace('User updated successfully');
                callback(null, {
                    message: 'User updated successfully',
                    data: updatedUser
                });
            }
        });
    },

    delete: (userId, callback) => {
        logger.info('Deleting user with ID:', userId);
        database.delete(userId, (err, deletedUser) => {
            if (err) {
                logger.error('Error deleting user:', err.message || 'unknown error');
                callback(err, null);
            } else {
                logger.trace('User deleted successfully');
                callback(null, {
                    message: 'User deleted successfully',
                    data: deletedUser
                });
            }
        });
    }




}

module.exports = userService
