import multer from "multer";

import ErrorResponse
from "../utils/errorResponse.js";




// Memory Storage
const storage =
  multer.memoryStorage();




// File Filter
const fileFilter = (
  req,
  file,
  cb
) => {

  if (
    file.mimetype ===
    "application/pdf"
  ) {

    cb(null, true);

  } else {

    cb(
      new ErrorResponse(
        "Only PDF files are allowed",
        400
      ),
      false
    );
  }
};




// Multer Upload Middleware
const upload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize:
      5 * 1024 * 1024
  }
});


export default upload;