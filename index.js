const mongoose = require('mongoose')
const express = require('express')
const app = express()
const dontenv = require('dotenv')
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')
const productRouter = require('./routes/product')
const orderRouter = require('./routes/order')
const cartRouter = require('./routes/cart')

dontenv.config()
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Database connection successful"))
    .catch((err) => {
        console.log(err);
    });

app.use(express.json());
app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/orders", orderRouter)

app.listen(process.env.PORT || 5000, () => {
    console.log('backend server is running');
})