const mongoose = require('mongoose')
const dotenv = require("dotenv")
dotenv.config()
const URI = process.env.DB_CONNECT

var connectdb = () =>{
    mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }).then(() => console.log("mongodb connected....."))
    .catch(err =>console.log(err))
}  


module.exports = connectdb