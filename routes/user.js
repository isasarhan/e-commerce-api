const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require('./verifytoken')
const { AES, enc } = require('crypto-js')
const User = require('../models/User')
const router = require('express').Router()

router.put("/:id", verifyTokenAndAuth, async (req, res) => {
    if (req.body.password) {
        req.body.password = AES.encrypt(req.body.password, process.env.PASS_SEC).toString(enc.Utf8)
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.body.id,
            {
                $set: req.body,
            },
            { new: true }
        )
        res.status(200).json(updatedUser)
    } catch (err) {
        res.status(401).json(err)
    }
})
//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted")
    } catch (err) {
        res.status(400).json(err)
    }
})
//Get User
router.get("/find/:id", verifyTokenAndAuth, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc
        res.status(200).json(others)
    } catch (err) {
        res.status(400).json(err)
    }
})
//Get All User
router.get("/", verifyTokenAndAuth, async (req, res, next) => {
    try {
        const query = req.body.query

        const users = query ?
            await User.find().sort({ _id: -1 }).limit(5)
            : await User.find()

        res.status(200).json(users)
    } catch (err) {
        res.status(400).json(err)
    }
})
//Get user status
router.get("/status", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                }
            }
        ])
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router
