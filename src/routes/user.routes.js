const express = require('express')
const assert = require('assert')
const chai = require('chai')
chai.should()
const router = express.Router()
const userController = require('../controllers/user.controller')
const logger = require('../util/logger')
const database = require('../dao/inmem-db')

// Tijdelijke functie om niet bestaande routes op te vangen
const notFound = (req, res, next) => {
    next({
        status: 404,
        message: 'Route not found',
        data: {}
    })
}

// Input validation functions for user routes
const validateUserCreate = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            emailAdress,
            password
        } = req.body;

        assert.ok(firstName, 'firstName should not be empty');
        assert.strictEqual(
            typeof firstName,
            'string',
            'firstName should be a string'
        );

        assert.ok(lastName, 'lastName should not be empty');
        assert.strictEqual(
            typeof lastName,
            'string',
            'lastName should be a string'
        );

        assert.ok(emailAdress, 'emailAddress should not be empty');
        assert.strictEqual(
            typeof emailAdress,
            'string',
            'emailAddress should be a string'
        );
        assert.ok(
            /^[a-zA-Z]{1}[.]{1}[a-zA-Z]{2,}@[a-zA-Z]{2,}\.[a-zA-Z]{2,3}$/.test(
                emailAdress
            ),
            'emailAddress should match the pattern'
        );

        assert.ok(password, 'password should not be empty');
        assert.strictEqual(
            typeof password,
            'string',
            'password should be a string'
        );
        assert.ok(
            /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(password),
            'password should match the pattern'
        );

        // Check if email address is already in use
        const isUnique = await checkEmailUniqueness(emailAdress);
        if (!isUnique) {
            throw new Error('Email address is already in use');
        }

        // Move to the next middleware if validation passes
        next();
    } catch (err) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid user data',
            error: err.toString(),
        });
    }
};

// Input validation function for updating user
const validateUserUpdate = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            emailAdress,
            password
        } = req.body;

        // Validate first name if provided
        if (firstName !== undefined) {
            assert.ok(firstName, 'firstName should not be empty');
            assert.strictEqual(
                typeof firstName,
                'string',
                'firstName should be a string'
            );
        }

        // Validate last name if provided
        if (lastName !== undefined) {
            assert.ok(lastName, 'lastName should not be empty');
            assert.strictEqual(
                typeof lastName,
                'string',
                'lastName should be a string'
            );
        }

        // Validate email address if provided
        if (emailAdress !== undefined) {
            assert.ok(emailAdress, 'emailAddress should not be empty');
            assert.strictEqual(
                typeof emailAdress,
                'string',
                'emailAddress should be a string'
            );
            assert.ok(
                /^[a-zA-Z]{1}[.]{1}[a-zA-Z]{2,}@[a-zA-Z]{2,}\.[a-zA-Z]{2,3}$/.test(
                    emailAdress
                ),
                'emailAddress should match the pattern'
            );

            // Check if email address is already in use if provided for update
            const isUnique = await checkEmailUniqueness(emailAdress);
            if (!isUnique) {
                throw new Error('Email address is already in use');
            }
        }

        // Validate password if provided
        if (password !== undefined) {
            assert.ok(password, 'password should not be empty');
            assert.strictEqual(
                typeof password,
                'string',
                'password should be a string'
            );
            assert.ok(
                /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(password),
                'password should match the pattern'
            );
        }

        // Move to the next middleware if validation passes
        next();
    } catch (err) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid user data',
            error: err.toString(),
        });
    }
};



//
// // Input validation function using Chai for POST /api/user
// const validateUserCreateChaiExpect = async (req, res, next) => {
//     try {
//         // Validate first name
//         chai.expect(req.body.firstName).to.not.be.empty;
//         chai.expect(req.body.firstName).to.be.a('string');
//
//         // Validate last name
//         chai.expect(req.body.lastName).to.not.be.empty;
//         chai.expect(req.body.lastName).to.be.a('string');
//
//         // Validate email address
//         chai.expect(req.body.emailAdress).to.not.be.empty;
//         chai.expect(req.body.emailAdress).to.be.a('string');
//         chai.expect(req.body.emailAdress).to.match(/@/);
//
//         // Check if email is unique
//         const isUnique = await checkEmailUniqueness(req.body.emailAdress);
//         if (!isUnique) {
//             throw new Error('Email address is already in use');
//         }
//
//         logger.trace('User successfully validated');
//         next();
//     } catch (ex) {
//         logger.error('User validation failed:', ex.message);
//         next({
//             status: 400,
//             message: ex.message,
//             data: {}
//         });
//     }
// };


// Function to check email uniqueness
const checkEmailUniqueness = async (email) => {
    return new Promise((resolve, reject) => {
        database.checkEmailUnique(email, (err, isUnique) => {
            if (err) {
                reject(err);
            } else {
                resolve(isUnique);
            }
        });
    });
};


// Userroutes
router.post('/api/user', validateUserCreate, userController.create)
router.get('/api/user', userController.getAll)
router.get('/api/user/:userId', userController.getById)

// Tijdelijke routes om niet bestaande routes op te vangen
router.put('/api/user/:userId',validateUserUpdate, userController.update)
router.delete('/api/user/:userId', userController.delete)

module.exports = router
