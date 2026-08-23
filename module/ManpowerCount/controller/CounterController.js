const CounterModel = require("../model/CounterModel");


module.exports = {
  getCounters: async (req, res) => {
    try {
      const counters = await CounterModel.find().sort({ createdAt: -1 });
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
      const counter = await CounterModel.create(req.body);
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
      const counter = await CounterModel.findByIdAndUpdate(
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
      const counter = await CounterModel.findByIdAndDelete(req.params.id);
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
      const counter = await CounterModel.findByIdAndUpdate(
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
