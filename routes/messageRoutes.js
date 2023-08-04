const express = require("express");
const authMiddleware = require("../middlewares/auth/authMiddleware");
const {
  getAllPrivateMessagesCtrl,
  getAllRoomMessagesCtrl,
} = require("../controllers/messageController");

const messageRouter = express.Router(); // Create an instance of the Express router

messageRouter.get("/private", authMiddleware, getAllPrivateMessagesCtrl);
messageRouter.get("/room/:roomId", authMiddleware, getAllRoomMessagesCtrl);

module.exports = messageRouter;
