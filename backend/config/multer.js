const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: process.env.CLOUDINARY_UPLOAD_FOLDER || "notes",
    resource_type: "auto",
    public_id: `${Date.now()}-${file.originalname}`, 
  }),
});


const upload = multer({ storage });

module.exports = upload;
