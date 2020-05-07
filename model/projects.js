const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectschema = new Schema({
    //@property residential or commericial
    ProjectFor:{
        type:String,
        require:true
    },
    ProjectType:{
        type:String,
        require:true
    },
    ProjectName:{
        type:String,
        require:true,
    },
    ProjectAddress:{
        type:String,
        require:true
    },
    ProjectCity:{
        type:String,
        trim:true
    },
    ProjectContactNo:{
        type:Number,
        require:true,
        unique:true
    },
    ProjectDetails:{
        type:String,
        require:true
    },
    Images:[
        {
            type:String
        }
    ],
    ProjectPriceinLakhs:{
        type:String,
        require:true
    },
    ProjectStatus:{
        type:String,
        require:true,
        trim:true
    },
    user:{
        type:Schema.Types.ObjectId,
        require:true,
        ref:"user"
    }
})

module.exports = mongoose.model("projects",projectschema)