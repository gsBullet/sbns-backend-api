const MemberModel = require("../../member/model/MemberModel");
const ThanaTeamModel = require("../model/ThanaTeamModel");

module.exports = {
  getMembersForThanaTeam: async (req, res) => {
    try {
      const members = await MemberModel.find({ status: true }).select(
        "name  phone description image",
      );
      return res.status(200).json({
        success: true,
        data: members,
        message: "Members for thana team fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "Failed to fetch members for thana team",
      });
    }
  },
  createThanaTeam: async (req, res) => {
    try {
      const newThanaTeam = await ThanaTeamModel.create(req.body);
      return res.status(201).json({
        success: true,
        data: newThanaTeam,
        message: "Thana team created successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
        message: "Failed to create Thana team",
      });
    }
  },
  getAllThanaTeams: async (req, res) => {
    try {
      const thanaTeams = await ThanaTeamModel.find({}).populate(
        "amir nayebeAmir secretary officeSecretary bm mediaSecretary teamMembers",
      );
      return res.status(200).json({
        success: true,
        data: thanaTeams,
        message: "Thana teams fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "Failed to fetch thana teams",
      });
    }
  },
  updateThanaTeam: async (req, res) => {
    try {
      const thanaTeam = await ThanaTeamModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      return res.status(200).json({
        success: true,
        data: thanaTeam,
        message: "Thana team updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "Failed to update thana team",
      });
    }
  },
  deleteThanaTeam: async (req, res) => {
    try {
      const thanaTeam = await ThanaTeamModel.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        data: thanaTeam,
        message: "Thana team deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "Failed to delete thana team",
      });
    }
  },
  updateThanaTeamStatus: async (req, res) => {
    try {
      const thanaTeam = await ThanaTeamModel.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true },
      );
      return res.status(200).json({
        success: true,
        data: thanaTeam,
        message: "Thana team status updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "Failed to update thana team status",
      });
    }
  },
};
