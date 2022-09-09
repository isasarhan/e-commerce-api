const router = require('express').Router()
const User = require('../models/User')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

//REGESTER
router.post("/register", async (req, res) => {
    try {

        const newUsr = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(
                req.body.password,
                process.env.PASS_SEC)
                .toString(),
        })
        const savedUser = await newUsr.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.log(err)
    }
})
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        !user && res.status(401).json("Wrong Credentials")
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        )
        const password = hashedPassword.toString(CryptoJS.enc.Utf8)

        password !== req.body.password
            && res.status(401).json("Wrong Credentails")

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        )
        const { pas, ...others } = user._doc
        res.status(200).json({others, accessToken})
        console.log("success");

    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router