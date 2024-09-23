import multer from 'multer';
import path from 'path';
import { __dirname } from '../utils.js';

const storageDocuments = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/uploads/documents'));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const storageProfiles = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/uploads/profiles'));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

export const uploadDocument = multer({ storage: storageDocuments })
export const uploadProfile = multer({ storage: storageProfiles })