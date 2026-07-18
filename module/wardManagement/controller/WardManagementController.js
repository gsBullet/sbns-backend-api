const WardManagementModel = require("../model/WardManagementModel");

module.exports = {
  createWardManagement: async (req, res) => {
    try {
      let { wardName, president, vicePresident, secretary, teamMembers } =
        req.body;

      // Convert string to array
      if (typeof teamMembers === "string") {
        teamMembers = JSON.parse(teamMembers);
      }

      const wardManagement = await WardManagementModel.create({
        wardName,
        president,
        vicePresident,
        secretary,
        teamMembers,
      });

      return res.status(201).json({
        success: true,
        data: wardManagement,
        message: "Ward management created successfully",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  getAllWardManagement: async (req, res) => {
    try {
      const wardManagements = await WardManagementModel.find()
        .populate("wardName")
        .populate("president")
        .populate("vicePresident")
        .populate("secretary")
        .populate("teamMembers");

      return res.status(200).json({
        success: true,
        data: wardManagements,
        message: "Ward managements retrieved successfully",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  getWardManagementById: async (req, res, next) => {
    try {
      const wardManagement = await WardManagementModel.findById(req.params.id);
      return res.status(200).json({
        success: true,
        data: wardManagement,
        message: "Ward management retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  updateWardManagement: async (req, res, next) => {
    try {
       let { wardName, president, vicePresident, secretary, teamMembers } =
        req.body;

      // Convert string to array
      if (typeof teamMembers === "string") {
        teamMembers = JSON.parse(teamMembers);
      }
      const updatedWardManagement = await WardManagementModel.findByIdAndUpdate(
        req.params.id,
        {
          wardName,
          president,
          vicePresident,
          secretary,
          teamMembers,
        },
        { new: true },
      );
      res.status(200).json({
        success: true,
        data: updatedWardManagement,
        message: "Ward management updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  deleteWardManagement: async (req, res, next) => {
    try {
      const deletedWardManagement = await WardManagementModel.findByIdAndDelete(
        req.params.id,
      );
      res.status(200).json({
        success: true,
        data: deletedWardManagement,
        message: "Ward management deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  updateWardManagementStatus: async (req, res, next) => {
    try {
      const updatedWardManagementStatus =
        await WardManagementModel.findByIdAndUpdate(
          req.params.id,
          { status: req.body.status },
          { new: true },
        );
      res.status(200).json({
        success: true,
        data: updatedWardManagementStatus,
        message: "Ward management status updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
