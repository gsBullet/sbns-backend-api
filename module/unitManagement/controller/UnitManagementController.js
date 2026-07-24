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
      const UnitManagements = await UnitManagementModel.find()
        .populate("wardName")
        .populate("president")
        .populate("vicePresident")
        .populate("secretary")
        .populate("officeSecretary")
        .populate("treasurer")
        .populate("mediaSecretary")
        .populate("otherSecretaries");
      const wardIds = UnitManagements.filter((unit) => unit.wardName).map(
        (unit) => unit.wardName._id,
      );

      const wardInfo = await WardManagementModel.find({
        _id: { $in: wardIds },
      })
        .populate("president")
        .populate("vicePresident")
        .populate("secretary")
        .populate("officeSecretary")
        .populate("treasurer")
        .populate("mediaSecretary")
        .populate("teamMembers");

      console.log(wardInfo);

      console.log(`wardInfo`, wardInfo);

      return res.status(200).json({
        success: true,
        data: UnitManagements,
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
