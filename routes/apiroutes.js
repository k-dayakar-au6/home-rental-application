const express = require('express')
const router = express.Router()
const authentication = require('../middlewares/authentication')
const buffertostring = require('../buffertostring')
const cloudinary = require('cloudinary').v2
const upload = require('../multer')
const dotenv = require("dotenv")

dotenv.config()

cloudinary.config({
    cloud_name:  process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET

})


const{registeruser,loginuser,changepassword,logoutuser,deactivateAccount,verifyemailtoken,
    sendforgotpasswordmail,checkforgotpassword,yourposts,yourprojects} = require('../controllers/apicontrollers')

    

router.post('/user/register',registeruser)
router.post('/user/login',loginuser)
router.delete('/user/logout',authentication,logoutuser)
router.post('/user/changepassword',authentication,changepassword)
router.post('/user/deactivateAccount',authentication,deactivateAccount)
router.post('/api/confirmemail/:token',verifyemailtoken)
router.post('/api/sendforgotpassword',sendforgotpasswordmail)
router.post('/api/checkforgotpassword/:token',checkforgotpassword)
router.get('/api/yourposts',authentication,yourposts)
router.get('/api/yourprojects',authentication,yourprojects)

router.post('/api/uploadimages/',authentication,upload.single("Images"),function(req,res){
    const ImageContent = buffertostring(req.file.originalname,req.file.buffer)

    cloudinary.uploader.upload(ImageContent)
    .then(function(imageresponse){
        console.log(imageresponse)
        if(imageresponse){
            Post.findOne({user:req.session.userId})
            .then(function(user){
                console.log(user)
                if(user){
                    user.Images.push(imageresponse.url)
                    user.save()
                    console.log("success")
                    res.status(200).json({message:"Images uploaded successfully"})
                }
            })
        }
        
    })
    .catch(function(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    })
})

module.exports = router


