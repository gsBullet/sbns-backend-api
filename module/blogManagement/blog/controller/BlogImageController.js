const buildImageUrl = (req, filename) =>
  `${req.protocol}://${req.get("host")}/uploads/blogs/${filename}`;
exports.uploadImage = async (req, res) => {

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }
    return res
      .status(200)
      .json({
        success: true,
        data: buildImageUrl(req, req.file.filename),
        message: "Image uploaded successfully",
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
