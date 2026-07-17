const { uploadFile } = require("../../../middlewares/updloadHandler");
const MemberModel = require("../model/MemberModel");
const path = require("path");
const fs = require("fs");

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
      let image = [];

      // Process image
      if (req.files?.image) {
        image = uploadFile(req.files.image, "uploads");
        console.log("image saved at:", image);
      }

      const newMember = new MemberModel({
        name,
        phone,
        presentAddress,
        permanentAddress,
        profession,
        responsibilities,
        organizationalValue,
        image: image,
      });

      const savedMember = await newMember.save();
      return res.status(201).json({
        success: true,
        message: "সদস্য সফলভাবে তৈরি হয়েছে",
        member: savedMember,
      });
    } catch (error) {
      console.error("Error creating:", error);
      return res.status(500).json({
        success: false,
        message: "সদস্য তৈরি হয়নি",
        error: error.message,
      });
    }
  },

  getAllMembers: async (req, res, next) => {
    try {
      const members = await MemberModel.find()
        .sort({ updatedAt: -1 })
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
        return res.status(404).json({ message: "সদস্য পাওয়া যায়নি" });
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
    let image; // ✅ declared in function scope, accessible in catch
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
        return res.status(404).json({ message: "সদস্য পাওয়া যায়নি" });
      }

      image = existingMember.image; // no `let` here anymore

      if (req.files?.image) {
        if (existingMember.image) {
          const oldImagePath = path.join(__dirname, "..", existingMember.image);
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }
        image = uploadFile(req.files.image, "uploads");
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
          image,
        },
        { new: true },
      );

      return res
        .status(200)
        .json({
          success: true,
          message: "সদস্য সফলভাবে আপডেট হয়েছে",
          member: updatedMember,
        });
    } catch (error) {
      if (req.files?.image && image) {
        const newImagePath = path.join(__dirname, "..", image);
        if (fs.existsSync(newImagePath)) fs.unlinkSync(newImagePath);
      }
      return res.status(500).json({ success: false, error: error.message });
    }
  },
  deleteMember: async (req, res, next) => {
    try {
      const member = await MemberModel.findById(req.params.id);

      if (!member) {
        return res.status(404).json({ message: "সদস্য পাওয়া যায়নি" });
      }

      // Delete image if exists
      if (member.image) {
        const imagePath = path.join(__dirname, "..", member.image);
        if (fs.existsSync(imagePath)) {
          try {
            fs.unlinkSync(imagePath);
            console.log("Image deleted successfully:", member.image);
          } catch (unlinkError) {
            console.error("Failed to delete image:", unlinkError.message);
            // Continue with member deletion even if image deletion fails
          }
        } else {
          console.log("Image file not found:", member.image);
        }
      }

      // Delete the member
      await MemberModel.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        success: true,
        message: "সদস্য সফলভাবে ডিলিট হয়েছে",
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
