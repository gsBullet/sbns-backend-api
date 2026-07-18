const UnitModel = require("../model/UnitModel");

module.exports = {
  getUnits: async (req, res) => {
    try {
      const units = await UnitModel.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        data: units,
        message: "Units retrieved successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  getUnitById: async (req, res) => {
    try {
      const unit = await UnitModel.findById(req.params.id);
      if (!unit) {
        return res
          .status(404)
          .json({ success: false, message: "Unit not found" });
      }
      return res.status(200).json({ success: true, data: unit });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  createUnit: async (req, res) => {
    try {
      const newUnit = await UnitModel.create(req.body);
      return res.status(201).json({
        success: true,
        message: "Unit created successfully",
        data: newUnit,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  updateUnit: async (req, res) => {
    try {
      const updatedUnit = await UnitModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        },
      );
      if (!updatedUnit) {
        return res
          .status(404)
          .json({ success: false, message: "Unit not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Unit updated successfully",
        data: updatedUnit,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteUnit: async (req, res) => {
    try {
      const deletedUnit = await UnitModel.findByIdAndDelete(req.params.id);
      if (!deletedUnit) {
        return res
          .status(404)
          .json({ success: false, message: "Unit not found" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Unit deleted successfully" });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  updateUnitStatus: async (req, res) => {
    try {
      const updatedUnit = await UnitModel.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true },
      );
      if (!updatedUnit) {
        return res
          .status(404)
          .json({ success: false, message: "Unit not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Unit status updated successfully",
        data: updatedUnit,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },
};
