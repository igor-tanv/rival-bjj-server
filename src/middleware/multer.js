const multer = require('multer')

//Error related to size-limits and extensions should be handled here
//NEXT: How to handle photo errors inside middleware 
const upload = multer({
    limits: {
        fileSize: 1000000
    },

    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})


module.exports = upload