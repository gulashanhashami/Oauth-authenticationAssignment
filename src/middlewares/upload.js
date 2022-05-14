const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  //code for, To accept the file pass
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    callback(null, true);
  } else {
    //code for, To reject this file pass
    callback(null, false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const uploadSingleFile = (fieldName) => {
  return (req, res, next) => {
    const uploadItem = upload.single(fieldName);

    uploadItem(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // Multer error
        res.send({ message: err.message, errorType: "MulterError" });
      } else if (err) {
        //unknown error
        res.send({ message: err.message, errorType: "NormalError" });
      }
      // if all things are ok
      next();
    });
  };
};
module.exports =  uploadSingleFile;
