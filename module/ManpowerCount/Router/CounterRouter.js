const express = require("express");
const router = express.Router();

const CounterController = require("../controller/CounterController");
const { protect } = require("../../../middlewares/auth");

router.get("/list", protect, CounterController.getCounters);
router.post("/create", protect, CounterController.createCounter);
router.put("/update-counter/:id", protect, CounterController.updateCounter);
router.delete("/delete-counter/:id", protect, CounterController.deleteCounter);
router.put(
    "/update-counter-status/:id",
    protect,
    CounterController.updateCounterStatus,
);

module.exports =()=> router;