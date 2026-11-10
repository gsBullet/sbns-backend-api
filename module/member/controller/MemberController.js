const { uploadFile } = require("../../../middlewares/updloadHandler");
const MemberModel = require("../model/MemberModel");
const path = require("path");
const fs = require("fs");

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000/";

// Helper: build a public URL for an uploaded file
const toPublicUrl = (subfolder, filename) =>
  `${BACKEND_URL.replace(/\/+$/, "")}/uploads/${subfolder}/${filename}`;

const parseIfString = (value, fallback) => {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Helper: remove an uploaded file from disk (used on failure / delete / replace)
const removeFileByUrl = (url) => {
  if (!url) return;
  try {
    const relative = url.split("/uploads/")[1]; // "thumbnails/xxx.png"
    if (!relative) return;
    const filePath = path.join(__dirname, "..", "uploads", relative);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Failed to remove file:", err.message);
  }
};

module.exports = {
  createMember: async (req, res, next) => {
    try {
      const {
        name,
        phone,
        presentAddress,
        permanentAddress,
        profession,
        responsibilities,
        organizationalValue,
      } = req.body;

      const newMember = new MemberModel({
        name,
        phone,
        presentAddress,
        permanentAddress,
        profession,
        responsibilities,
        organizationalValue,
        image: toPublicUrl("members",req.file.filename),
      });

      const savedMember = await newMember.save();
      return res.status(201).json({
        success: true,
        message: "Member created successfully",
        member: savedMember,
      });
    } catch (error) {
      removeFileByUrl();

      console.error("Error creating:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create member",
        error: error.message,
      });
    }
  },

  getAllMembers: async (req, res, next) => {
    try {
      const members = await MemberModel.find()
        .sort({ createdAt: -1 })
        .select("-__v")
        .populate("responsibilities")
        .exec();
      return res.status(200).json({
        success: true,
        data: members,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  getMemberById: async (req, res, next) => {
    try {
      const member = await MemberModel.findById(req.params.id)
        .populate("responsibilities")
        .select("-__v"); // Exclude the __v field
      if (!member) {
        return res.status(404).json({ message: "No member found with that ID" });
      }
      return res.status(200).json({
        success: true,
        data: member,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  updateMember: async (req, res, next) => {
   
    try {
      const {
        name,
        phone,
        presentAddress,
        permanentAddress,
        profession,
        responsibilities,
        organizationalValue,
      } = req.body;

      const existingMember = await MemberModel.findById(req.params.id);
      if (!existingMember) {
        return res.status(404).json({ message: "No member found with that ID" });
      }

    

      let parsedResponsibilities = [];
      try {
        parsedResponsibilities = responsibilities
          ? JSON.parse(responsibilities)
          : [];
      } catch {
        parsedResponsibilities = [];
      }

      const updatedMember = await MemberModel.findByIdAndUpdate(
        req.params.id,
        {
          name,
          phone,
          presentAddress,
          permanentAddress,
          profession,
          responsibilities: parsedResponsibilities,
          organizationalValue,
          image: req.file? toPublicUrl("members", req.file.filename) : existingMember.image,
        },
        { new: true },
      );

      return res.status(200).json({
        success: true,
        message: "Member updated successfully",
        member: updatedMember,
      });
    } catch (error) {
      if (req.file) {
        removeFileByUrl(toPublicUrl("members", req.file.filename));
      }
      return res.status(500).json({ success: false, error: error.message });
    }
  },
  deleteMember: async (req, res, next) => {
    try {
      const member = await MemberModel.findById(req.params.id);

      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }

      if (member.image) {
        removeFileByUrl(member.image);
      }

      // Delete the member
      await MemberModel.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Member deleted successfully",
      });
    } catch (error) {
      console.error("Delete member error:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
  updateMemberStatus: async (req, res, next) => {
    try {
      const { status } = req.body;
      const updatedMember = await MemberModel.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true },
      );
      if (!updatedMember) {
        return res.status(404).json({ message: "সদস্য পাওয়া যায়নি" });
      }
      return res.status(200).json({
        success: true,
        message: "স্টাটাস সফলভাবে আপডেট হয়েছে",
        member: updatedMember,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
};
