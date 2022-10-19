const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require('./verifytoken')
const { AES, enc } = require('crypto-js')
const Product = require('../models/Product')
const router = require('express').Router()

//CREATE
router.post("/", async (req, res) => {
    const newProduct = new Product(req.body)

    try {
        const savedProduct = await newProduct.save()

        res.status(200).json(savedProduct)
    } catch (err) {

    }
})

//UPDATE
router.put("/:id", verifyTokenAndAuth, async (req, res) => {

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.body.id,
            {
                $set: req.body,
            },
            { new: true }
        )
        res.status(200).json(updatedProduct)
    } catch (err) {
        res.status(401).json(err)
    }
})
//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted")
    } catch (err) {
        res.status(400).json(err)
    }
})
//Get Product
router.get("/find/:id", async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (err) {
        res.status(400).json(err)
    }
})
//Get All Products
router.get("/", async (req, res, next) => {
    const qNew = req.query.new
    const qCategory = req.query.category
    try {
        let products
        if (qNew) {
            products = Product.find().sort({ createdAt: -1 }).limit(5)
        } else if (qCategory)
            products = Product.find({
                categories: {
                    $in: [qCategory]
                }
            })
        else{
            products = await Product.find()
        }

        res.status(200).json(products)
    } catch (err) {
        res.status(400).json(err)
    }
})

module.exports = router
