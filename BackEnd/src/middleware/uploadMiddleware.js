// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Define the absolute path to the 'uploads' folder where files will be saved
// const uploadPath = path.join(__dirname, "..", "..", "uploads");
// // Check if the 'uploads' folder exists; if not, create it
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath);
//   console.log("Upload directory created:", uploadPath);
// }

// // Configure multer to store uploaded files on disk
// const storage = multer.diskStorage({
//   // Specify the folder to save uploaded files
//   destination: function (req, file, cb) {
//     cb(null, uploadPath);
//   },
//   // Use the original file name for saving the file, with timestamp prefix to avoid conflicts
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     const filename = Date.now() + ext;
//     cb(null, filename);
//   },
// });

// // Allow only PNG and JPEG image files to be uploaded
// const fileFilter = function (req, file, cb) {
//   const allowedTypes = ["image/png", "image/jpeg"];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only .png and .jpg files are allowed"), false);
//   }
// };

// // Create the multer upload instance with storage, size limit, and file filter settings
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // Set max file size to 10 MB
//   },
//   fileFilter: fileFilter,
// });

// // Middleware to handle image upload with multer only. Cloudinary upload is handled in controller.
// const handleImageUpload = (req, res, next) => {
//   // No need to set req.body.image here; controller will handle Cloudinary upload
//   next();
// };

// module.exports = { upload, handleImageUpload };
