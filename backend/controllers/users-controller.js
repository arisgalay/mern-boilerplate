const { validationResult } = require('express-validator')
// models
const HttpError = require('../models/http-error')
const User = require('../models/user')

// const DUMMY_USERS = [
//     {
//         id: '1',
//         name: 'Risx',
//         email: 'risx@mail.com',
//         password: 'testing',
//     },
// ]

const getAllUsers = async (req, res, next) => {
  let users
  try {
    users = await User.find({}, '-password')
  } catch (err) {
    return next(new HttpError('Fetching users failed, please try again'))
  }
  res.status(200).json(users.map((u) => u.toObject({ getters: true })))
}

const signUp = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    //console.log(errors)
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    )
  }

  const { name, email, password } = req.body

  // const userExists = DUMMY_USERS.find((u) => u.email === email)
  // if (userExists) {
  //     throw new HttpError(
  //         'Could not create a user, email already exist.',
  //         422
  //     )
  // }

  let userExists
  try {
    userExists = await User.findOne({ email })
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later.')
    return next(error)
  }
  if (userExists) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    )
    return next(error)
  }

  const createdUser = new User({
    name,
    email,
    password,
    places: [],
  })

  // DUMMY_USERS.push(createdUser)
  try {
    await createdUser.save()
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again.')
    return next(error)
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) })
}

const logIn = async (req, res, next) => {
  const { email, password } = req.body

  let existingUser

  try {
    existingUser = await User.findOne({ email })
  } catch (err) {
    const error = new HttpError(
      'Loggin in failed, please try again later.',
      500
    )
    return next(error)
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    )
    return next(error)
  }

  res.json({
    message: 'Logged in!',
    user: existingUser.toObject({ getters: true }),
  })
}
exports.getAllUsers = getAllUsers
exports.signUp = signUp
exports.logIn = logIn
