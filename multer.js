const multer = require('multer')
const imageinjectdate = require('./imageinjectdate')
const multerconfig = multer({
    storage: multer.diskStorage({
        destination:"./uploads/",
        filename: function(req,file,cb){
            cb(null, imageinjectdate(file.originalname))
        }
    }),
    limits: 1024 * 1024 *  5,
    fileFilter: function(req,file,cb){
        if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
            cb(null, true)
        }else{
            const newerror = new Error("File type incorrect")
            newerror.name = "MultiError"
            cb(newerror,false)
        }
    }
})

const multerconfig1 = multer({
    storage: multer.memoryStorage()
})
const upload = multer(multerconfig1)

module.exports = upload