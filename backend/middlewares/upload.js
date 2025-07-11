const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); 

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: process.env.CLOUDINARY_UPLOAD_FOLDER || "notesSharingFiles",
    resource_type: "auto",
    format: async (req, file) => file.originalname.split(".").pop(), 
    public_id: (req, file) => {
      const name = file.originalname.split(".")[0];
      return `${Date.now()}-${name}`;
    },
  },
});
const upload = multer({ storage });
module.exports = upload;
