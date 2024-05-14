const userService = require('../services/user.service')
const logger = require('../util/logger')

let userController = {
    create: (req, res, next) => {
        const user = req.body
        logger.info('create user', user.firstName, user.lastName)
        userService.create(user, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getAll: (req, res, next) => {
        logger.trace('getAll');
        const { isActive, field2 } = req.query;

        userService.getAll(isActive, field2, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                });
            }
            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                });
            }
        });
    },

    getById: (req, res, next) => {
        const userId = req.params.userId;
        logger.trace('userController: getById', userId);
        userService.getById(userId, null, (error, result) => {
            if (error) {
                next({
                    status: error.status || 500, // Default to 500 if status is not defined
                    message: error.message || 'Internal Server Error', // Default error message
                    data: {} // Empty data object
                });
            } else {
                res.status(200).json({
                    status: 200,
                    message: result.message || 'Success', // Default success message
                    data: result.data || {} // Default empty data object
                });
            }
        });
    },


    update: (req, res, next) => {
        const userId = req.params.userId;
        const updatedUserData = req.body;
        logger.info('Updating user with id:', userId);
        userService.update(userId, updatedUserData, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                });
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                });
            }
        });
    },

    delete: (req, res, next) => {
        const userId = req.params.userId;
        logger.info('Deleting user with id:', userId);
        userService.delete(userId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                });
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                });
            }
        });
    },

    getProfile: (req, res, next) => {
        const userId = req.userId
        logger.trace('getProfile for userId', userId)
        userService.getProfile(userId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                })
            }
        })
    }

}

module.exports = userController
