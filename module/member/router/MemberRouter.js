const express = require("express");
const router = express.Router();
const memberController = require("../controller/MemberController");
const {
  validateMemberCreation,
  validateMemberUpdate,
} = require("../../../middlewares/validators");
// let upload = require("../../../middlewares/updloadHandler");
const { protect } = require("../../../middlewares/auth");

// Create a new member
router.post(
  "/create-member",
  protect,
  validateMemberCreation,
  memberController.createMember,
);

// Get all members
router.get("/get-all-members", protect, memberController.getAllMembers);

// Get a single member by ID
router.get("/get-member/:id",protect, memberController.getMemberById);

// Update a member by ID
router.post(
  "/update-member/:id",
  protect,
  validateMemberUpdate,
  memberController.updateMember,
);

router.put(
  "/update-member-status/:id",
  protect,
  memberController.updateMemberStatus,
);

// Delete a member by ID
router.delete("/delete-member/:id", protect, memberController.deleteMember);

module.exports = () => router;
