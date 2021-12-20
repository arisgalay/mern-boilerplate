const axios = require('axios')
const API_KEY = 'AIzaSyBTF8zpkDOeL5jrKk6BZ_16kJEjPLYLXME'
// models
const HttpError = require('../models/http-error')

async function getCoordinatesForAddress(address) {
    // const response = await axios.get(
    //     `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    //         address
    //     )}&key=${API_KEY}`
    // )

    const response = await axios.get(
        `https://api.codetabs.com/v1/geolocation/json`
    )

    const data = response.data

    if (!data || data.status === 'ZERO_RESULTS') {
        const error = new HttpError(
            'Could not find location for the specified address.',
            404
        )
        throw error
    }

    //const coordinates = data.results[0].geometry.location
    // request denied
    const coordinates = {
        lat: data.latitude,
        lng: data.longitude,
    }
    return coordinates
}

module.exports = getCoordinatesForAddress
