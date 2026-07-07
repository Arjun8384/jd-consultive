const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let gfs;

mongoose.connection.once("open", () => {
  gfs = new GridFSBucket(
    mongoose.connection.db,
    {
      bucketName: "resumes",
    }
  );

  console.log("GridFS Ready");
});

module.exports = () => {
  console.log("Returning bucket:", !!gfs);
  return gfs;
};