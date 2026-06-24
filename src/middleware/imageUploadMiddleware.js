import multer from "multer";
import ErrorResponse from "../utils/errorResponse.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ErrorResponse("Only JPEG, PNG, and WebP images are allowed", 400),
      false,
    );
  }
};

const imageUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

export default imageUpload;
