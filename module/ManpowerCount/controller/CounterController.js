const CouterModel = require("../model/CouterModel");

module.exports = {
  getCounters: async (req, res) => {
    try {
      const counters = await CouterModel.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        data: counters,
        message: "Counters retrieved successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  createCounter: async (req, res) => {
    try {
      const counter = await CouterModel.create(req.body);
      return res.status(200).json({
        success: true,
        data: counter,
        message: "Counter created successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  updateCounter: async (req, res) => {
    try {
      const counter = await CouterModel.findByIdAndUpdate(
        req.params.id,
        req.body ,
        { new: true },
      );
      return res.status(200).json({
        success: true,
        data: counter,
        message: "Counter updated successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  deleteCounter: async (req, res) => {
    try {
      const counter = await CouterModel.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        data: counter,
        message: "Counter deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  updateCounterStatus: async (req, res) => {
    try {
      const counter = await CouterModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      return res.status(200).json({
        success: true,
        data: counter,
        message: "Counter status updated successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
