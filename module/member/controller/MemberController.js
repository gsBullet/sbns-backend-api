const { uploadFile } = require("../../../middlewares/updloadHandler");
const MemberModel = require("../model/MemberModel");

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
      const members = await MemberModel.find().populate("responsibilities");
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
      const member = await MemberModel.findById(req.params.id).populate(
        "responsibilities",
      );
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
    try {
      const {
        name,
        phone,
        presentAddress,
        permanentAddress,
        profession,
        responsibilities,
      } = req.body;

       // Process image
      if (req.files?.image) {
        image = uploadFile(req.files.image, "uploads");
        console.log("image saved at:", image);
      }


      const updatedMember = await MemberModel.findByIdAndUpdate(
        req.params.id,
        {
          name,
          phone,
          presentAddress,
          permanentAddress,
          profession,
          responsibilities,
          image: image,
        },
        { new: true },
      );

      if (!updatedMember) {
        return res.status(404).json({ message: "সদস্য পাওয়া যায়নি" });
      }

      return res.status(200).json({
        success: true,
        message: "সদস্য সফলভাবে আপডেট হয়েছে",
        member: updatedMember,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  deleteMember: async (req, res, next) => {
    try {
      const deletedMember = await MemberModel.findByIdAndDelete(req.params.id);
      if (!deletedMember) {
        return res.status(404).json({ message: "সদস্য পাওয়া যায়নি" });
      }
      return res.status(200).json({
        success: true,
        message: "সদস্য সফলভাবে ডিলিট হয়েছে",
      });
    } catch (error) {
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
        message: "সদস্য সফলভাবে আপডেট হয়েছে",
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
