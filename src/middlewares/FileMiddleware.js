const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/tmp')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `${Date.now()}.${ext}`);
    }
})
const upload = multer({ storage: storage });

module.exports = {
    imgUser(req, res, next) {
        upload.single('avatar')(req, res, next, err => {
            if(err) {
                return res.send({message:'Erro'})
            }
            next();
        });
    },
    gameFiles(req, res, next) {
        upload.fields([{name: 'gameFile', maxCount: 1}, {name: 'imgs', maxCount: 8}])(req, res, next, err => {
            if(err) {
                return res.send({message: 'Erro'})
            }
            next();
        })
    }
}