const multer = require('multer')

const fileStorage = multer.diskStorage({
    destination: (req,file,cb) => { 
        cb(null,'images')
    },
    filename: (req, file, cb) => { 
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix+file.originalname);
        //cb(null,file.filename +'-'+file.originalname)
    }
})
const fileFilter = (req,file,cb) => {
    if (file.mimetype === 'image/png' || 'image/jpg' || 'image/jpeg') { 
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const upload = multer({
    storage: fileStorage,
    fileFilter
}).single('image')

module.exports= upload