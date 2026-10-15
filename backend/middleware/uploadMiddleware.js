const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload folders exist
const uploadDir = path.join(__dirname, '..', 'uploads');
const avatarDir = path.join(uploadDir, 'avatars');
const sessionDir = path.join(uploadDir, 'sessions');
const resourceDir = path.join(uploadDir, 'resources');

[uploadDir, avatarDir, sessionDir, resourceDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ============================================
// AVATAR UPLOAD
// ============================================
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  }
});

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only image files are allowed'));
};

const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

// ============================================
// SESSION ATTACHMENTS UPLOAD
// ============================================
const sessionStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, sessionDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `session-${req.params.id}-${Date.now()}${ext}`);
  }
});

const sessionFileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|pdf|doc|docx|txt|ppt|pptx|xls|xlsx/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime =
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/pdf' ||
    file.mimetype.includes('word') ||
    file.mimetype.includes('excel') ||
    file.mimetype.includes('powerpoint') ||
    file.mimetype === 'text/plain';

  if (ext && mime) cb(null, true);
  else cb(new Error('File type not allowed'));
};

const sessionUpload = multer({
  storage: sessionStorage,
  fileFilter: sessionFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// ============================================
// STUDY HUB RESOURCE UPLOAD (NEW)
// ============================================
const resourceStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, resourceDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // Sanitize filename
    const safeName = file.originalname
      .replace(/[^a-z0-9.-]/gi, '_')
      .substring(0, 50);
    cb(null, `resource-${req.user.id}-${Date.now()}-${safeName}${ext}`);
  }
});

const resourceFileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|pdf|doc|docx|ppt|pptx|xls|xlsx|zip|txt/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime =
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/pdf' ||
    file.mimetype.includes('word') ||
    file.mimetype.includes('excel') ||
    file.mimetype.includes('powerpoint') ||
    file.mimetype === 'application/zip' ||
    file.mimetype === 'application/x-zip-compressed' ||
    file.mimetype === 'text/plain';

  if (ext && mime) cb(null, true);
  else cb(new Error('Only PDF, DOC, PPT, XLS, ZIP, images, and text files are allowed'));
};

const resourceUpload = multer({
  storage: resourceStorage,
  fileFilter: resourceFileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB
});

module.exports = {
  avatarUpload,
  sessionUpload,
  resourceUpload
};