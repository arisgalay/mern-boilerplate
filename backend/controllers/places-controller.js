const { validationResult } = require('express-validator')
const getCoordinatesForAddress = require('../util/location')
// models
const HttpError = require('../models/http-error')
const Place = require('../models/place')

// Dummy data
let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous skyscrapers in the world!',
        location: {
            lat: 40.7484474,
            lng: -73.9871516,
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1',
    },
    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the most famous skyscrapers in the world!',
        location: {
            lat: 40.7484474,
            lng: -73.9871516,
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u2',
    },
]

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
        const error = new HttpError(
            'Something went wrong, could not find a place.'
        )
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
        //console.log(errors)
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        )
    }

    const { id, title, description, address, creator } = req.body

    let coordinates
    try {
        coordinates = await getCoordinatesForAddress(address)
    } catch (error) {
        console.log(coordinates)
        return next(error)
    }

    const createdPlace = new Place({
        id,
        title,
        description,
        location: coordinates,
        address,
        creator,
    })

    // DUMMY_PLACES.push(createdPlace)
    try {
        await createdPlace.save()
    } catch (err) {
        return next(
            new HttpError('Creating place failed, please try again.', 500)
        )
    }

    res.status(201).json({ place: createdPlace })
}

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        //console.log(errors)
        throw new HttpError(
            'Invalid inputs passed, please check your data.',
            422
        )
    }

    const { title, description } = req.body
    const placeId = req.params.pid
    let updatedPlace
    try {
        updatedPlace = await Place.findById(placeId)
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update place'
        )
        return next(error)
    }

    // const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) }
    // const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId)

    updatedPlace.title = title
    updatedPlace.description = description

    try {
        await updatedPlace.save()
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update place'
        )
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
        place = await Place.findById(placeId)
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not deleted a place.'
        )
    }

    try {
        await place.remove()
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

    res.status(200).json({ message: 'Deleted place.' })
}

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid

    // const places = DUMMY_PLACES.filter((p) => {
    //     return p.creator === userId
    // })
    let place
    try {
        place = await Place.find({ creator: userId })
    } catch (error) {
        return next(
            new HttpError(
                'Something went wrong, could not find the place for provided user id'
            )
        )
    }

    if (!place || place.length === 0) {
        // const error = new Error(
        //     'Could not find place for the provided user id.'
        // )
        // error.code = 404
        // return next(error)
        return next(
            new HttpError(
                'Could not find places for the provided user id.',
                404
            )
        )
    }

    res.status(200).json(place)
}

exports.getAllPlaces = getAllPlaces
exports.getPlaceById = getPlaceById
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace
exports.getPlacesByUserId = getPlacesByUserId
