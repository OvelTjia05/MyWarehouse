const express = require('express');
const router = express.Router();
const itemController = require('./controller');
const { decodeToken } = require('../../middleware/authentication');
const multer = require('multer');
const storage = multer.memoryStorage({});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Tangani kesalahan yang dihasilkan oleh Multer
    if (err.code === 'LIMIT_FILE_SIZE') {
      console.log('sini');
      req.fileValidationError = 'Image must be less than 3MB';
    } else {
      req.fileValidationError = 'Terjadi kesalahan saat mengunggah file';
    }
  } else {
    req.fileValidationError = 'Invalid File Type';
  }
  next();
};

const upload = multer({
  storage,
  limits: { fileSize: 3000000 },
  fileFilter: (req, file, cb, next) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Invalid file type');
      error.code = 'INVALID_FILE_TYPE';
      return cb(error, false);
    }

    cb(null, true);
  },
});

router.post(
  '/:id_user',
  decodeToken,
  upload.single('picture'),
  handleMulterError,
  itemController.createItemByIdUser
);
router.get('/:id_user', decodeToken, itemController.getItemByIdUser);
router.put(
  '/:id_item',
  decodeToken,
  upload.single('picture'),
  handleMulterError,
  itemController.updateItemByIdItem
);
router.delete('/', decodeToken, itemController.deleteItemByIdItem);

module.exports = router;
