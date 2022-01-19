const express = require('express')
const { check } = require('express-validator')
// controllers
const placesController = require('../controllers/places-controller')

const router = express.Router()

router
  .get('/', placesController.getAllPlaces)
  .post(
    '/',
    [
      check('title').not().isEmpty(),
      check('description').isLength({ min: 5 }),
      check('address').not().isEmpty(),
    ],
    placesController.createPlace
  )

router
  .get('/:pid', placesController.getPlaceById)
  .patch(
    '/:pid',
    [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
    placesController.updatePlace
  )
  .delete('/:pid', placesController.deletePlace)

router.get('/user/:uid', placesController.getPlacesByUserId)

module.exports = router
