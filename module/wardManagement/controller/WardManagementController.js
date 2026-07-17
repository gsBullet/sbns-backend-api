const WardManagementModel = require("../model/WardManagementModel");

module.exports = {
  createWardManagement: async (req, res, next) => {
    try {
      const { wardName, president, vicePresident, secretary, teamMembers } =
        req.body;
      if (
        !wardName ||
        !president ||
        !vicePresident ||
        !secretary ||
        !teamMembers
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const wardManagement = await WardManagementModel.createWardManagement({
        wardName,
        president,
        vicePresident,
        secretary,
        teamMembers,
      });

      res.status(201).json({
        success: true,
        data: wardManagement,
        message: "Ward management created successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  getAllWardManagement: async (req, res, next) => {
    try {
      const wardManagements =
        await WardManagementService.getAllWardManagement();
      res.status(200).json({
        success: true,
        data: wardManagements,
        message: "Ward managements retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  getWardManagementById: async (req, res, next) => {
    try {
      const wardManagement = await WardManagementService.getWardManagementById(
        req.params.id,
      );
      res.status(200).json({
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
      const updatedWardManagement =
        await WardManagementService.updateWardManagement(
          req.params.id,
          req.body,
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
      const deletedWardManagement =
        await WardManagementService.deleteWardManagement(req.params.id);
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
        await WardManagementService.updateWardManagementStatus(
          req.params.id,
          req.body.status,
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
