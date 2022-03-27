const util = require("util")
const fs = require("fs")
const multer = require("multer")
const maxSize = 50 * 1024 * 1024

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, req.dir)
    },
    filename: (req, file, cb) => {
        var filename = atob(file.originalname)
        folder = filename.split('/')
        var file = folder.pop()
        folder[0] = req.params.problem_code + "/" + req.test_hash
        folder = folder.join('/')
        if(!fs.existsSync(`${req.dir}/${folder}`)) 
            fs.mkdirSync(`${req.dir}/${folder}`) 
        
        cb(null, folder + '/' + file)
    },
})

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).array("file", 200)

let uploadFileMiddleware = util.promisify(uploadFile)
module.exports = uploadFileMiddleware