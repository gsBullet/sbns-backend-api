const NewsLetterModel = require("../model/NewsLetterModel");

const buildpdfThumbnail = (req, filename) =>
  `${req.protocol}://${req.get("host")}/uploads/hero-banners/${filename}`;
const buildpdf = (req, filename) =>
  `${req.protocol}://${req.get("host")}/uploads/pdfs/${filename}`;

// CREATE — POST /api/newsletters
exports.createNewsLetter = async (req, res) => {
  console.log(req.files);
  try {
    const { month, year } = req.body;

    // req.files comes from multer's upload.fields() middleware
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({
        success: false,
        message: "A pdf file is required",
      });
    }

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required",
      });
    }

    const existing = await NewsLetterModel.findOne({ month, year });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A newsletter for this month already exists",
      });
    }

    const newsletter = new NewsLetterModel({
      month,
      year,
      // pdfThumbnail : buildpdfThumbnail(req, req.files.pdfThumbnail[0].filename),
      pdf: buildpdf(req, req.files.pdf[0].filename),
    });

    const saved = await newsletter.save();
    return res.status(201).json({
      success: true,
      message: "Newsletter created successfully",
      data: saved,
    });
  } catch (error) {
    // Handle duplicate "month" (unique: true) gracefully
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A newsletter for this month already exists",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to create newsletter",
      error: error.message,
    });
  }
};

// READ ALL — GET /api/newsletters
exports.getNewsLetters = async (req, res) => {
  try {
    const { status, year } = req.query;
    const filter = {};
    if (status !== undefined) filter.status = status === true;
    if (year) filter.year = year;

    const newsletters = await NewsLetterModel.find(filter).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      count: newsletters.length,
      data: newsletters,
      message: "Newsletters retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch newsletters",
      error: error.message,
    });
  }
};

// READ ONE — GET /api/newsletters/:id
exports.getNewsLetterById = async (req, res) => {
  try {
    const newsletter = await NewsLetterModel.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: "Newsletter not found",
      });
    }
    return res.status(200).json({ success: true, data: newsletter });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch newsletter",
      error: error.message,
    });
  }
};

// UPDATE — PUT /api/newsletters/:id
exports.updateNewsLetter = async (req, res) => {
  try {
    const updateData = { ...req.body };

    const { month, year } = updateData;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required",
      });
    }

    const existing = await NewsLetterModel.findOne({ month, year });
    if (existing && existing._id.toString() !== req.params.id) {
      return res.status(400).json({
        success: false,
        message: "A newsletter for this month already exists",
      });
    }

   
    // Only overwrite pdf/pdfThumbnail if new files were actually uploaded
    if (req.files && req.files.pdf) {
      updateData.pdf = buildpdf(req, req.files.pdf[0].filename);
    }

    const updated = await NewsLetterModel.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Newsletter not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Newsletter updated successfully",
      data: updated,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A newsletter for this month already exists",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update newsletter",
      error: error.message,
    });
  }
};

// DELETE — DELETE /api/newsletters/:id
exports.deleteNewsLetter = async (req, res) => {
  try {
    const deleted = await NewsLetterModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Newsletter not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Newsletter deleted successfully",
      data: deleted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete newsletter",
      error: error.message,
    });
  }
};

// UPDATE STATUS — PATCH /api/newsletters/:id/status
exports.updateNewsLetterStatus = async (req, res) => {
  console.log(req.body);

  try {
    const { status } = req.body;

    const newStatus = status === "true" ? true : false;

    const updated = await NewsLetterModel.findByIdAndUpdate(
      req.params.id,
      { status: newStatus },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Newsletter not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Newsletter status updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update newsletter status",
      error: error.message,
    });
  }
};
