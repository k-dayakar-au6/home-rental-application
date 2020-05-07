const express = require('express')
const router = express.Router()
const Project = require('../model/projects')
const authentication = require('../middlewares/authentication')
const cloudinary = require('cloudinary').v2
const upload = require('../multer')
const dotenv = require("dotenv")
dotenv.config()

cloudinary.config({
    cloud_name:  process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET

})


const {addproject,updateproject,deleteproject,getallprojects,getdatabyresorcom,getdatabycity,getdatabystatus,pagination,searchresult}= require('../controllers/projectapicontrollers')

router.post('/api/addproject',authentication,addproject);
router.patch('/api/updateproject/:projectid',authentication,updateproject)
router.delete('/api/deleteproject/:projectid',authentication,deleteproject)
router.get('/api/getallprojects',getallprojects)
router.get('/api/getdatabyprojectype/:projecttype',getdatabyresorcom)
router.get('/api/getdatabycity/:projectcity',getdatabycity)
router.get('/api/getdatabystatus/:projectstatus',getdatabystatus)
router.post('/api/pagination',pagination)
router.post('/api/searchresult/:projecttype',searchresult)
router.post('/api/uploadprojectimages',authentication,upload.single("Images"),function(req,res){
    const ImageContent = buffertostring(req.file.originalname,req.file.buffer)

    cloudinary.uploader.upload(ImageContent)
    .then(function(imageresponse){
        console.log(imageresponse)
        if(imageresponse){
            Project.findOne({user:req.session.userId})
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
