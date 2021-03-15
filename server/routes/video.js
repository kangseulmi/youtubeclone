const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");

//storage multer config
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) =>{
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

const upload = multer({ storage: storage }).single("file");
//=================================
//             Video
//=================================

router.post('/uploadfiles', (res, req) => {
    
    //비디오를 서버에 저장한다
    upload(req, res, err=> {
        if(err){
            return res.json({success: false, err})
        }
        return res.json({success: true, url: res.req.file.path, fileName: res.req.filename})
    })
})

router.post('/thumbnail', (res, req) => {
    
    //썸네일 생성하고 비디오 러닝타임 정보등 가져오기

    let filePath = ""
    let fileDuration = ""
    ffmpeg.ffprobe(req.body.url, function(err, matadata){
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    });

    ffmpeg(req.body.url)
    .on('filenames', function(filenames) {
        filePath = "uploads/thumbnails/" + filenames[0]
    })
    .on('end', function() {
        return res.json({ success: true, url: filePath, fileDuration: fileDuration})
    })
    .on('error', function(err){
        return res.json({ success: false, err });
    })
    .screenshots({
        count :3,
        folder: 'uploads/thumbnails',
        size : '320x240',
        filename: 'thumbnail-%b.png'
    })

})

module.exports = router;

