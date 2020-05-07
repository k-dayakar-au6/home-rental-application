const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const PostSchema = new Schema({
    //@select between owner or dealer
    WhatYouAre:{
        type:String,
        required:true,
        trim:true
    },
    //@buy or Rent or Paying Guest
    ListPropertyFor:{
        type:String,
        required:true,
        trim:true
    },
    //@residencial or commercial
    YourPropertyFor:{
        type:String,
        required:true,
        trim:true
    },
    //@if residencial Apartment/villa/FarmHouse/service Apartment
    //@if commercial Office/Shop/Complex
    PropertyType:{
        type:String,
        required:true,
        trim:true
    },
    AccomadationFor:{
        //@if residencial Family/singleman/singlewomen/No Preference
        type:String,
        default:"",
        required:true
    },
    Address:{
        type:String,
        required:true,
    },
    City:{
        type:String,
        required:true,
        trim:true
    },
    ProjectName:{
        type:String,
        required:true
    },
    Pricing:{
        type:Number,
        required:true
    },
    Features:{
        type:String,
        default:"",
        required:true
    },
    ContactNo:{
        type:Number,
        unique:true
    },
    Images:[{
        type:String
    }],
    user:{
        type:Schema.Types.ObjectId,
        require:true,
        ref:"user"
    }


})

module.exports = mongoose.model("posts", PostSchema)