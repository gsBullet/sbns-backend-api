const MemberModel = require("../../member/model/MemberModel");
const ThanaTeamModel = require("../model/ThanaTeamModel");

// ── Helpers ──────────────────────────────────────────────────
const ROLE_LABELS = {
  amir: "আমীর",
  nayebeAmir: "নায়েবে আমীর",
  secretary: "সেক্রেটারি",
  officeSecretary: "অফিস সেক্রেটারি",
  bm: "বায়তুলমাল সম্পাদক",
  mediaSecretary: "মিডিয়া সম্পাদক",
  teamMembers: "টিম সদস্য",
};
const ROLE_KEYS = Object.keys(ROLE_LABELS);

// লিস্টে সদস্যের যে ফিল্ডগুলো দরকার (ফ্রন্টএন্ডের টেবিল ও View মডালের জন্য)
const MEMBER_FIELDS = "name phone image presentAddress profession";

// প্রতিটি পদের এন্ট্রি এখন { member, shortSpeech, bio }, তাই populate হয় "<পদ>.member" এ
const TEAM_POPULATE = ROLE_KEYS.map((key) => ({
  path: `${key}.member`,
  select: MEMBER_FIELDS,
}));

// req.body থেকে শুধু পদের ফিল্ডগুলো নেয় (status ইত্যাদি বাইরে থেকে বদলানো যাবে না)
const pickTeamFields = (body = {}) =>
  ROLE_KEYS.reduce((acc, key) => {
    if (body[key] !== undefined) acc[key] = body[key];
    return acc;
  }, {});

// Mongoose ValidationError থেকে "পদ: মেসেজ" আকারে পরিষ্কার বার্তা বানায়
const getErrorMessage = (error, fallback) => {
  if (error.name === "ValidationError") {
    const [path, err] = Object.entries(error.errors)[0] || [];
    if (err) {
      const label = ROLE_LABELS[String(path).split(".")[0]];
      return label ? `${label}: ${err.message}` : err.message;
    }
  }
  if (error.name === "CastError") return "অবৈধ আইডি বা ডেটা পাঠানো হয়েছে";
  return fallback;
};

module.exports = {
  getMembersForThanaTeam: async (req, res) => {
    try {
      const members = await MemberModel.find({ status: true }).select(
        "name phone image presentAddress profession",
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
      // শুধু একটি থানা টিম রাখা যাবে (ফ্রন্টএন্ডের নিয়মের সাথে মিলিয়ে)
      const alreadyExists = await ThanaTeamModel.exists({});
      if (alreadyExists) {
        return res.status(409).json({
          success: false,
          message: "ইতিমধ্যে একটি থানা টিম আছে।",
        });
      }

      const newThanaTeam = await ThanaTeamModel.create(
        pickTeamFields(req.body),
      );
      return res.status(201).json({
        success: true,
        data: newThanaTeam,
        message: "Thana team created successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
        message: getErrorMessage(error, "Failed to create Thana team"),
      });
    }
  },

  getAllThanaTeams: async (req, res) => {
    try {
      const thanaTeams = await ThanaTeamModel.find({}).populate(TEAM_POPULATE);
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
        pickTeamFields(req.body),
        // runValidators ছাড়া আপডেটে বাণী/জীবনীর বাধ্যতামূলক নিয়ম কাজ করে না
        { new: true, runValidators: true },
      );
      if (!thanaTeam) {
        return res.status(404).json({
          success: false,
          message: "Thana team not found",
        });
      }
      return res.status(200).json({
        success: true,
        data: thanaTeam,
        message: "Thana team updated successfully",
      });
    } catch (error) {
      const isInvalid =
        error.name === "ValidationError" || error.name === "CastError";
      return res.status(isInvalid ? 400 : 500).json({
        success: false,
        error: error.message,
        message: getErrorMessage(error, "Failed to update thana team"),
      });
    }
  },

  deleteThanaTeam: async (req, res) => {
    try {
      const thanaTeam = await ThanaTeamModel.findByIdAndDelete(req.params.id);
      if (!thanaTeam) {
        return res.status(404).json({
          success: false,
          message: "Thana team not found",
        });
      }
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
      if (typeof req.body.status !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "status must be true or false",
        });
      }
      const thanaTeam = await ThanaTeamModel.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true },
      );
      if (!thanaTeam) {
        return res.status(404).json({
          success: false,
          message: "Thana team not found",
        });
      }
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