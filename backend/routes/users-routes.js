const { check } = require('express-validator')
const express = require('express')
// controllers
const usersController = require('../controllers/users-controller')
const router = express.Router()

router
    .get('/', usersController.getAllUsers)
    .post(
        '/signup',
        [
            check('name').not().isEmpty(),
            check('email').normalizeEmail().isEmail(),
            check('password').isLength({ min: 6 }),
        ],
        usersController.signUp
    )
    .post('/login', usersController.logIn)

module.exports = router
