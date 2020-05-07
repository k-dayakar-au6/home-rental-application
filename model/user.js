const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname:{
        type: String,
        required:true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    Mobilenumber:{
        type:Number,
        require:true,
        trim:true
    },
    isConfirmed:{
        type:Boolean,
        default:false,
        trim:true
    },
    confirmtoken:{
        type:String,
        require:true,
        default:" "
    },
    resettoken:{
        type:String,
        required:true,
        default:" "
    },
    createdAt:{
        type: Date,
        required:true,
        default:Date.now
    },
},
    { timestamps: true }
);

userSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, 10)
    .then(function (hashedPassword) {
        user.password = hashedPassword;
        next();
    })
})

module.exports = mongoose.model('user', userSchema);