const path = require('path')

module.exports = function imageinjectdate(filename){
    const extname = path.extname(filename)
    const newFilename = filename.replace(extname,"")+"-"+Date.now()+extname
    return newFilename
}
