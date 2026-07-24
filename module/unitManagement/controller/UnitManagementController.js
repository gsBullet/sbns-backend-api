const WardManagementModel = require("../../wardManagement/model/WardManagementModel");
const UnitManagementModel = require("../model/UnitManagementModel");

module.exports = {
  createUnitManagement: async (req, res) => {
    try {
      let {
        wardName,
        unitName,
        president,
        vicePresident,
        secretary,
        officeSecretary,
        treasurer,
        mediaSecretary,
        otherSecretaries,
      } = req.body;

      // Convert string to array
      if (typeof otherSecretaries === "string") {
        otherSecretaries = JSON.parse(otherSecretaries);
      }

      const UnitManagement = await UnitManagementModel.create({
        wardName,
        unitName,
        president,
        vicePresident,
        secretary,
        officeSecretary,
        treasurer,
        mediaSecretary,
        otherSecretaries,
      });

      return res.status(201).json({
        success: true,
        data: UnitManagement,
        message: "Unit management created successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  getAllUnitManagement: async (req, res) => {
    try {
      const unitData = await UnitManagementModel.aggregate([
        {
          $lookup: {
            from: "wardmanagements",
            localField: "wardName",
            foreignField: "wardName",
            as: "wardManagement",
          },
        },
        {
          $unwind: {
            path: "$wardManagement",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      // Populate UnitManagement's own top-level ref fields
      let data = await UnitManagementModel.populate(unitData, [
        { path: "president" },
        { path: "vicePresident" },
        { path: "secretary" },
        { path: "officeSecretary" },
        { path: "treasurer" },
        { path: "mediaSecretary" },
        { path: "otherSecretaries" },
        { path: "unitName" },
        { path: "wardName" },
      ]);

      // Populate nested wardManagement fields — MUST specify `model` explicitly,
      // since these came from $lookup and have no schema-based ref info
      data = await UnitManagementModel.populate(data, [
        { path: "wardManagement.wardName", model: "wards" }, // adjust model name/ref target as needed
        { path: "wardManagement.president", model: "members" }, // replace "User" with whatever president refs
        { path: "wardManagement.vicePresident", model: "members" },
        { path: "wardManagement.secretary", model: "members" },
        // { path: "wardManagement.officeSecretary", model: "members" },
        // { path: "wardManagement.treasurer", model: "members" },
        // { path: "wardManagement.mediaSecretary", model: "members" },
        // { path: "wardManagement.teamMembers", model: "members" },
      ]);

      return res.status(200).json({
        success: true,
        data,
        message: "Unit managements retrieved successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  getUnitManagementById: async (req, res, next) => {
    try {
      const UnitManagement = await UnitManagementModel.findById(req.params.id);
      return res.status(200).json({
        success: true,
        data: UnitManagement,
        message: "Unit management retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  updateUnitManagement: async (req, res, next) => {
    try {
      let {
        wardName,
        unitName,
        president,
        vicePresident,
        secretary,
        officeSecretary,
        treasurer,
        mediaSecretary,
        otherSecretaries,
      } = req.body;

      // Convert string to array
      if (typeof otherSecretaries === "string") {
        otherSecretaries = JSON.parse(otherSecretaries);
      }
      const updatedUnitManagement = await UnitManagementModel.findByIdAndUpdate(
        req.params.id,
        {
          wardName,
          unitName,
          president,
          vicePresident,
          secretary,
          officeSecretary,
          treasurer,
          mediaSecretary,
          otherSecretaries,
        },
        { new: true },
      );
      return res.status(200).json({
        success: true,
        data: updatedUnitManagement,
        message: "Unit management updated successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  deleteUnitManagement: async (req, res, next) => {
    try {
      const deletedUnitManagement = await UnitManagementModel.findByIdAndDelete(
        req.params.id,
      );
      return res.status(200).json({
        success: true,
        data: deletedUnitManagement,
        message: "Unit management deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  updateUnitManagementStatus: async (req, res, next) => {
    try {
      const updatedUnitManagementStatus =
        await UnitManagementModel.findByIdAndUpdate(
          req.params.id,
          { status: req.body.status },
          { new: true },
        );
      res.status(200).json({
        success: true,
        data: updatedUnitManagementStatus,
        message: "Unit management status updated successfully",
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
