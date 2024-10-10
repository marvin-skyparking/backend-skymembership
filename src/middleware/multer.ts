import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { BadRequest } from '../utils/response/common.response';

// Define the root path for uploads
const rootPath = path.resolve(__dirname, '../../'); // Adjust as per your project structure

// Storage configuration for files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';

    // Define paths for different field names
    if (file.fieldname === 'plate_number_image') {
      uploadPath = path.join(rootPath, 'uploads/plate_number_image/');
    } else if (file.fieldname === 'stnk_image') {
      uploadPath = path.join(rootPath, 'uploads/stnk_image/');
    } else {
      // Invalid field name
      return cb(new Error('Invalid Field Name'), '');
    }

    cb(null, uploadPath); // Pass the resolved upload path
  },
  filename: (req, file, cb) => {
    // Generate a unique file name using a timestamp and random number
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname) // Append the file extension
    );
  }
});

// Define file filter to allow only specific file types (jpg, jpeg, png, pdf)
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Only allow image files or PDFs
  if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
    return cb(new Error('Invalid file type')); // Reject invalid file types
  }
  cb(null, true); // Accept valid file types
};

// Create the multer instance with the custom storage and file filter configuration
const upload = multer({ storage, fileFilter }).fields([
  { name: 'plate_number_image', maxCount: 1 },
  { name: 'stnk_image', maxCount: 1 }
]);

// Middleware function to handle file uploads
export function handleFileUploads(
  req: Request,
  res: Response,
  next: NextFunction
) {
  upload(req, res, (err) => {
    if (err) {
      // Handle Multer error (like invalid file type or upload failure)
      return BadRequest(res, 'Error uploading file', err.message);
    }
    next(); // Proceed to the next middleware or controller if upload is successful
  });
}

// Remove Image IF FAIL
export function removeUploadedFiles(files: {
  [key: string]: Express.Multer.File[];
}) {
  Object.keys(files).forEach((key) => {
    const filePath = path.join(
      __dirname,
      '../../uploads/',
      key,
      files[key][0].filename
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Remove file
    }
  });
}
