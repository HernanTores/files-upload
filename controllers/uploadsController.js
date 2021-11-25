const {StatusCodes} = require('http-status-codes')
const path = require('path')
const {BadRequestError} = require('../errors')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

const uploadProductImageLocal = async (req, res) => {
    if (!req.files) {
        throw new BadRequestError('No file uploaded')
    }
    const productImage = req.files.image
    if (!productImage.mimetype.startsWith('image')) {
        throw new BadRequestError('Please provide a image')
    }
    const maxSize = 1024 * 1024
    if (productImage.size > maxSize) {
        throw new BadRequestError('Please provide image smaller 1K')
    }
    const pathImage = path.join(__dirname, '../public/uploads/', productImage.name)
    await productImage.mv(pathImage)
    return res.status(StatusCodes.OK).json({image: {src: `/uploads/${productImage.name}`}})
}

const uploadProductImage = async (req, res) => {
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        use_filename: true,
        folder: 'file-upload'
    })
    fs.unlinkSync(req.files.image.tempFilePath)
    return res.status(StatusCodes.OK).json({image: {src: result.secure_url}})
}

module.exports = {uploadProductImage}