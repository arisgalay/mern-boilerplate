const { validationResult } = require('express-validator')
// models
const HttpError = require('../models/http-error')

const DUMMY_USERS = [
    {
        id: '1',
        name: 'Risx',
        email: 'risx@mail.com',
        password: 'testing',
    },
]

const getAllUsers = (req, res, next) => {
    res.status(200).json(DUMMY_USERS)
}

const signUp = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        //console.log(errors)
        throw new HttpError(
            'Invalid inputs passed, please check your data.',
            422
        )
    }

    const { id, name, email, password } = req.body

    const userExists = DUMMY_USERS.find((u) => u.email === email)
    if (userExists) {
        throw new HttpError(
            'Could not create a user, email already exist.',
            422
        )
    }

    const createdUser = {
        id,
        name,
        email,
        password,
    }

    DUMMY_USERS.push(createdUser)
    res.status(201).json({ user: createdUser })
}

const logIn = (req, res, next) => {
    const { email, password } = req.body
    const identifiedUser = DUMMY_USERS.find((u) => u.email === email)
    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError(
            'Could not identify user, credentials seem to be wrong.',
            401
        )
    }

    res.json({ message: 'Logged in!' })
}
exports.getAllUsers = getAllUsers
exports.signUp = signUp
exports.logIn = logIn
