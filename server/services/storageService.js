const multer = require('multer');
const path = require('path');
const fs = require('fs');

const os = require('os');
const isVercel = Boolean(process.env.VERCEL);
const uploadDir = isVercel ? path.join(os.tmpdir(), 'agrishield_uploads') : path.join(__dirname, '..', 'uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  console.warn('Upload directory fallback to tmpdir on Vercel');
}

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `crop-${uniqueSuffix}${ext}`);
  }
});

// File filter (accept only valid image formats: JPG, JPEG, PNG, WEBP)
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image type. Please upload a JPG, JPEG, PNG, or WebP image.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB max file size
  }
});

module.exports = {
  upload,
  uploadDir
};
