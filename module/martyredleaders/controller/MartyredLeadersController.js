const MartyredLeaderModel = require("../model/MartyredLeaderModel");

module.exports = {
  getOurAllHeroes: async (req, res) => {
    try {
      const response = await MartyredLeaderModel.find().sort({ createdAt: -1 });
      return res
        .status(200)
        .json({
          success: true,
          data: response,
          message: "Martyred leaders fetched successfully",
        });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },
  createOurHero: async (req, res) => {
    try {
      const newOurHero = await MartyredLeaderModel.create(req.body);
      return res.status(201).json({ success: true, data: newOurHero });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },
  updateOurHeros: async (req, res) => {
    try {
      const updatedOurHero = await MartyredLeaderModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      return res.status(200).json({ success: true, data: updatedOurHero });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },
  updateOurHerosStatus: async (req, res) => {
    try {
      const updatedOurHero = await MartyredLeaderModel.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true },
      );
      return res.status(200).json({ success: true, data: updatedOurHero });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },
  deleteOurHero: async (req, res) => {
    try {
      const deletedOurHero = await MartyredLeaderModel.findByIdAndDelete(
        req.params.id,
      );
      return res.status(200).json({ success: true, data: deletedOurHero });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },
};
