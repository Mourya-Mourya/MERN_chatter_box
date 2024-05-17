// we will write everything related to user
const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// 2 ways we can do this
// we will be writing login in controllers.

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);

module.exports = router;
