require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

const connectDB = require('./db/connect')

const productRouter = require('./routes/productRoutes')

app.use(fileUpload({useTempFiles: true}))
app.use(express.json())
app.use(express.static('./public'))

const notFound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')

app.get('/', (req, res) => {
  res.send('<h1>FILE UPLOAD</h1>')
})

app.use('/api/v1/products', productRouter)

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`Server listening on port: ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()