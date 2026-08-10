const { uploadFile } = require("../../../../middlewares/updloadHandler");

exports.uploadImage = async (req, res) => {
  try {
    let image = [];

    // Process image
    if (req.files?.image) {
      image = uploadFile(req.files.image, "uploads");
      console.log("image saved at:", image);
    }
    return res
      .status(200)
      .json({
        success: true,
        data: image,
        message: "Image uploaded successfully",
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
