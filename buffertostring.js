const datauri = require('datauri')
const path = require('path')


const dataurichild = new datauri()

module.exports = function(originalname,buffer){
    const extention = path.extname(originalname)
    return dataurichild.format(extention,buffer).content
}