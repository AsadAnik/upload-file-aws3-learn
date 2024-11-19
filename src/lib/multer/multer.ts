import multer from "multer";

// Using Disk Storage..
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, './uploads');
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});


// // Using Memory Storage..
// const storage = multer.memoryStorage();


// Allowed MIME types for different fields
const allowedMimeTypes: Record<string, string[]> = {
  profilePic: ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'],
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
};

// File filtering function
const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  const fieldAllowedMimeTypes = allowedMimeTypes[file.fieldname];

  if (fieldAllowedMimeTypes && fieldAllowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error(
        `Invalid file type for field "${file.fieldname}". Received: ${file.mimetype}.`
      )
    ); // Reject the file
  }
};


// Single file upload
const singleUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Maximum 5MB per file
}).single('profilePic'); // Change 'profilePic' to your field name


// Multiple files upload
const multipleUpload = multer({
  storage,
  fileFilter,
  limits: { files: 5, fileSize: 5 * 1024 * 1024 } // Maximum 5 files, 5MB per file
}).array('files', 5); // Change 'documents' to your field name and limit to 5 files


// Multi-field uploads
const multiFieldUpload = multer({
  storage,
  fileFilter,
  limits: { files: 5, fileSize: 5 * 1024 * 1024 } // Maximum 5 files, 5MB per file
}).fields([
  { name: 'profilePic', maxCount: 1 }, // Single profile picture
  { name: 'documents', maxCount: 5 },   // Up to 5 documents
]);

// Example of Upload to s3
const cloudUpload = multer({
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('profilePic');

export { singleUpload, multipleUpload, multiFieldUpload, cloudUpload };
