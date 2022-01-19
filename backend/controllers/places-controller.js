const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
// models
const HttpError = require('../models/http-error')
const Place = require('../models/place')
const User = require('../models/user')

const getAllPlaces = async (req, res, next) => {
  let place
  try {
    place = await Place.find()
  } catch (err) {
    return next(
      new HttpError('Something went wrong, could not find all places.')
    )
  }

  res.status(200).json(place.map((p) => p.toObject({ getters: true })))
}

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid

  // const place = DUMMY_PLACES.find((p) => {
  //     return p.id === placeId
  // })
  let place
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find a place.')
    return next(error)
  }

  if (!place) {
    // const error = new Error('Could not find place for the provided id.')
    // error.code = 404
    // throw error
    const error = new HttpError(
      'Could not find place for the provided id.',
      404
    )
    return next(error)
  }

  res.status(200).json({ place: place.toObject({ getters: true }) })
}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    )
  }

  const { title, description, address, creator } = req.body

  const createdPlace = new Place({
    title,
    description,
    location: {
      lat: 15.5883,
      lng: 120.9192,
    },
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
    address,
    creator,
  })

  let user

  try {
    user = await User.findById(creator)
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again.', 500)
    return next(error)
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404)
    return next(error)
  }

  try {
    const sess = await mongoose.startSession()
    sess.startTransaction()
    await createdPlace.save({ session: sess })
    user.places.push(createdPlace)
    await user.save({ session: sess })
    await sess.commitTransaction()
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again.', 500)
    return next(error)
  }

  res.status(201).json({ place: createdPlace })
}

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    //console.log(errors)
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    )
  }

  const { title, description } = req.body
  const placeId = req.params.pid
  let updatedPlace
  try {
    updatedPlace = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update place')
    return next(error)
  }

  // const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) }
  // const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId)

  updatedPlace.title = title
  updatedPlace.description = description

  try {
    await updatedPlace.save()
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update place')
    return next(error)
  }

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) })
}

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid

  // if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
  //     throw new HttpError('Could not find a place for that id.', 404)
  // }

  // DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId)
  let place
  try {
    place = await Place.findById(placeId).populate('creator')
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not deleted a place.'
    )
  }
  if (!place) {
    return next(
      new HttpError('Could not find places for the provided  id.', 404)
    )
  }

  try {
    const sess = await mongoose.startSession()
    sess.startTransaction()
    await place.remove({ session: sess })
    place.creator.places.pull(place)
    await place.creator.save({ session: sess })
    await sess.commitTransaction()
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not deleted a place.'
    )
    return next(error)
  }

  res.status(200).json({ message: 'Deleted place.' })
}

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid

  // let places;
  let userWithPlaces
  try {
    userWithPlaces = await User.findById(userId).populate('places')
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later.',
      500
    )
    return next(error)
  }

  // if (!places || places.length === 0) {
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id.', 404)
    )
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  })
}

exports.getAllPlaces = getAllPlaces
exports.getPlaceById = getPlaceById
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace
exports.getPlacesByUserId = getPlacesByUserId
