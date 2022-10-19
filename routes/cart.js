const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require('./verifytoken')
const { AES, enc } = require('crypto-js')
const Cart = require('../models/Cart')
const router = require('express').Router()

//CREATE
router.post("/", async (req, res) => {
    const newCart = new Cart(req.body)

    try {
        const savedCart = await newCart.save()

        res.status(200).json(savedCart)
    } catch (err) {

    }
})

//UPDATE
router.put("/:id", verifyTokenAndAuth, async (req, res) => {

    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.body.id,
            {
                $set: req.body,
            },
            { new: true }
        )
        res.status(200).json(updatedCart)
    } catch (err) {
        res.status(401).json(err)
    }
})
//DELETE
router.delete("/:id", verifyTokenAndAuth, async (req, res, next) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted")
    } catch (err) {
        res.status(400).json(err)
    }
})
//Get User Cart
router.get("/find/:cartId", verifyTokenAndAuth, async (req, res, next) => {
    try {
        const cart = await Cart.findOne({userId:req.params.userId})
        res.status(200).json(cart)
    } catch (err) {
        res.status(400).json(err)
    }
})
//Get All 
router.get("/", async (req, res, next) => {
    try{
        const carts = await Cart.find();
        res.status(200).json(carts)
    } catch (err) {
        res.status(400).json(err)
    }
})

module.exports = router
