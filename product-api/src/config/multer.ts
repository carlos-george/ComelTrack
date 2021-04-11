import dotenv from 'dotenv';
dotenv.config();

import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import multerS3 from 'multer-s3'
import aws from 'aws-sdk';


const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
        },
        filename(request, file, callback) {

            const hash = crypto.randomBytes(10).toString('hex');

            file.filename = `${hash}-${file.originalname}`;

            callback(null, file.filename);
        },
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: 'comel-track',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            const hash = crypto.randomBytes(10).toString('hex');

            file.filename = `${hash}-${file.originalname}`;

            cb(null, file.filename);
        },
    }),
};

export default {
    dest: path.resolve(__dirname, '..', '..', 'uploads'),
    storage: storageTypes[process.env.STORAGE_TYPE!],
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allawedMimes = [
            "image/jpeg",
            "image/pjpeg",
            "image/png",
        ];
        if (allawedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type.'));
        }
    },
}