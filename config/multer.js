const multer = require('multer');
const path = require('path');

const imgpath = '/files/images';
const pdfpath = '/files/pdf';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, path.join(__dirname, '..', pdfpath));
        } else {
            cb(null, path.join(__dirname, '..', imgpath));
        }
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + extension);
    }
});

const upload = multer({
    storage: storage
});

module.exports = upload;