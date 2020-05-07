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

const sess = {
    secret: process.env.SESSION_SECRET,
    resave:false,
    name:"Home-rental-app",
    saveUninitialized:false,
    cookie:{
        maxAge: 1000*60*30,
        httpOnly:true,
        secure: false,
        sameSite:"strict"
    }
}

if(app.get('env')==='production'){
    app.set('trust proxy',1)
    sess.cookie.secure = true
}
app.use(session(sess))
app.use(apiroutes)
app.use(postapiroutes)
app.use(projectapiroutes)

app.use(function(err,req,res,next){
    if(err.name === "MulterError") res.status(400).send(err.message)
    res.send(err.message)
})

app.get('/',function(req,res){
    res.status(200).json({message:"hello welcome to home-rental-app"})
})
const port = process.env.PORT || 3000
app.listen(port, ( ) => console.log('server connced successfully'))


