const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");
const router = express.Router();

// we will create first route to create a chat, and we will include protect also as only logined one chan access chats.
router.route("/").post(protect, accessChat);
// fetch chat for that particular user
router.route("/").get(protect, fetchChats);

router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

module.exports = router;
