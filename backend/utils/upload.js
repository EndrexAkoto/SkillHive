import multer from 'multer';
import path from 'path';
import fs from 'fs';
import __dirname from './path.js';

const uploadRoot = path.join(__dirname, '../uploads');
const profilePhotosDir = path.join(uploadRoot, 'profile-photos');

if (!fs.existsSync(profilePhotosDir)) {
  fs.mkdirSync(profilePhotosDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, profilePhotosDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!/^image\//.test(file.mimetype)) {
      return cb(new Error('Only image uploads are allowed'));
    }
    cb(null, true);
  }
});

export { uploadRoot };
export default upload;
