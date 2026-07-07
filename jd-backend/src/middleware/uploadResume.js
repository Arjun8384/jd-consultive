const multer = require("multer");

module.exports = multer({

  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowed.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(new Error("Only PDF, DOC and DOCX files are allowed."));

  },

});