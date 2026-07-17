const WardModel = require("../model/WardModel");

module.exports = {
  createWard: async (req, res) => {
    try {
      const newWard = await WardModel.create(req.body);
      return res
        .status(201)
        .json({
          success: true,
          message: "Ward created successfully",
          data: newWard,
        });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  getWards: async (req, res) => {
    try {
      const wards = await WardModel.find();
      return res.status(200).json({ success: true, data: wards });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  getWardById: async (req, res) => {
    try {
      const ward = await WardModel.findById(req.params.id);
      if (!ward) {
        return res
          .status(404)
          .json({ success: false, message: "Ward not found" });
      }
      return res.status(200).json({ success: true, data: ward });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  updateWard: async (req, res) => {
    try {
      const updatedWard = await WardModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      if (!updatedWard) {
        return res
          .status(404)
          .json({ success: false, message: "Ward not found" });
      }
      return res
        .status(200)
        .json({
          success: true,
          message: "Ward updated successfully",
          data: updatedWard,
        });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteWard: async (req, res) => {
    try {
      const deletedWard = await WardModel.findByIdAndDelete(req.params.id);
      if (!deletedWard) {
        return res
          .status(404)
          .json({ success: false, message: "Ward not found" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Ward deleted successfully" });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },
  updateWardStatus: async (req, res) => {
    try {
      const updatedWard = await WardModel.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true },
      );
      if (!updatedWard) {
        return res
          .status(404)
          .json({ success: false, message: "Ward not found" });
      }
      return res
        .status(200)
        .json({
          success: true,
          message: "Ward status updated successfully",
          data: updatedWard,
        });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },
};
