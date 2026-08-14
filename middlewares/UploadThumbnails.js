const fs = require("fs-extra");
const path = require("path");

const uploadFile = (file, directory = "uploads/thumbnails") => {
  let imageName = file.name.split(".")[0];
  let imageExtension = file.name.split(".")[1];

  fileName =
    directory + "/" + imageName + "-" + Date.now() + "." + imageExtension;

  const targetPath = path.join(__dirname, "../") + "/" + fileName;

  try {
    fs.move(file.path, targetPath, (err) => {
      console.log(err);
    });

    return fileName;
  } catch (error) {
    return "";
  }
};

exports.uploadFile = uploadFile;