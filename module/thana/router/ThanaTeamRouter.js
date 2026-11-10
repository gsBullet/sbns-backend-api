const express = require("express");
const router = express.Router();
const thanaController = require("../controller/ThanaController");
const { protect } = require("../../../middlewares/auth");

router.get("/members-for-thana-team/list", protect, thanaController.getMembersForThanaTeam);
router.get("/list", protect, thanaController.getAllThanaTeams);
router.post("/create", protect, thanaController.createThanaTeam);
router.post("/update-thana-team/:id", protect, thanaController.updateThanaTeam);
router.delete("/delete-thana-team/:id", protect, thanaController.deleteThanaTeam);
router.post(
    "/update-thana-team-status/:id",
    protect,
    thanaController.updateThanaTeamStatus,
);
module.exports =()=> router;