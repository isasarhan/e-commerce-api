const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require('./verifytoken')
const { AES, enc } = require('crypto-js')
const Order = require('../models/Order')
const router = require('express').Router()

//CREATE
router.post("/", async (req, res) => {
    const newOrder = new Order(req.body)

    try {
        const savedOrder = await newOrder.save()

        res.status(200).json(savedOrder)
    } catch (err) {

    }
})

//UPDATE
router.put("/:id", verifyTokenAndAuth, async (req, res) => {

    try {
        const updateOrder = await Order.findByIdAndUpdate(
            req.body.id,
            {
                $set: req.body,
            },
            { new: true }
        )
        res.status(200).json(updateOrder)
    } catch (err) {
        res.status(401).json(err)
    }
})
//DELETE
router.delete("/:id", verifyTokenAndAuth, async (req, res, next) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted")
    } catch (err) {
        res.status(400).json(err)
    }
})
//Get User Orders
router.get("/find/:userId", verifyTokenAndAuth, async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
        res.status(200).json(orders)
    } catch (err) {
        res.status(400).json(err)
    }
})
//Get All 
router.get("/", async (req, res, next) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders)
    } catch (err) {
        res.status(400).json(err)
    }
})
//GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))

    try {
        const income = await Order.aggregate([
            {
                $match: { createdAt: { $gte: previousMonth } },
            }, 
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {

                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            },
        ]);
        res.status(200).json(income)
    } catch (err) {
        res.status(401).json(err)
    }
})
module.exports = router
