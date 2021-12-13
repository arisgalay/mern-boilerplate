const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()

// inititialize DB
const port = process.env.PORT || 8000

//middle ware
app.use(cors())
app.use(express.json())

// routes
app.get('/', (req, res) => {
    res.json('API Works!')
})

app.listen(port, () => {
    console.log(`Backend running on port: ${port}`)
})