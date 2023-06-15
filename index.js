require("express-async-errors")
require("dotenv").config();
const userRouter = require('./src/routers/userRouter')
const authRoute = require("./src/routers/authRouter")
const express = require('express');
const fileUpload = require('express-fileupload');
require("./db.js")();

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api/v1/users', userRouter)
app.use('/api/v1/signin', authRoute)

app.use((err,req,res,next) => {
    console.log(err.message);
    res.send(err.message);
});


app.get('/', (req, res) => {
    res.send("home")
})

const PORT = process.env.PORT || 4001

app.listen(PORT, console.log(`server listens ${PORT}`))