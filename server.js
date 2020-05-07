const express = require('express')
const methodoverride = require('method-override')
const path = require('path')
const dotenv = require('dotenv')
const connectdb = require('./db')
const session = require('express-session')
const bodyParser = require('body-parser')


const apiroutes = require('./routes/apiroutes')
const postapiroutes = require('./routes/postapiroutes')
const projectapiroutes= require('./routes/projectroutes')

const app = express()
app.use(express.json({extended:false}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodoverride('_method'))
dotenv.config()
connectdb()


app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        name: "Home-renting",
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 30,
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        }
    })
);
app.use(apiroutes)
app.use(postapiroutes)
app.use(projectapiroutes)

app.use(function(err,req,res,next){
    if(err.name === "MulterError") res.status(400).send(err.message)
    res.send(err.message)
})
const port = process.env.Port || 3000


app.listen(port, ( ) => console.log('server connced successfully'))


