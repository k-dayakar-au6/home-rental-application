const express = require('express')
const router = express.Router()
const authentication = require('../middlewares/authentication')
const Post = require('../model/posts')



const{posts,updatepost,deletepost,getallposts,getdatabyownerordealer,
        getdatabyproperty,searchbycity,rentaccommadationfor,paginationresult,
        searchresult} = require('../controllers/postapicontrollers')



router.post('/api/postad',authentication,posts)
router.patch('/api/updatepost/:postid',authentication,updatepost)
router.delete('api/deletepost/:postid',authentication,deletepost)
router.get('/api/getallposts',getallposts)
router.post('/api/getdatabyownerordealer/:whatyouare',getdatabyownerordealer)
router.post('/api/getdatabybuyorrent/:PropertyType',getdatabyproperty)
router.post('/api/searchbycity/:searchbycity',searchbycity)
router.post('/api/rentaccommadationfor/:accommadation',rentaccommadationfor)
router.post('/api/paginatedresult',paginationresult)
router.post('/api/searchresult/:buyorrent/:propertyfor',searchresult)   



module.exports = router


