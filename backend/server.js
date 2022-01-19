const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

// routes
const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')
// error handling model
const HttpError = require('./models/http-error')

const app = express()

// inititialize DB
const port = process.env.PORT || 8000

//middle ware
//app.use(cors())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// routes endpoint
app.use('/api/places', placesRoutes)
app.use('/api/users', usersRoutes)
// incorrect routes error handling
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404)
  throw error
})
//middle ware
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error)
  }
  res.status(error.code || 500)
  res.json({ message: error.message || 'An unknown error occured!' })
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend running on port: ${port}`)
    })
  })
  .catch((err) => {
    console.error(`${err}`)
  })
