const express = require("express");
const authMiddleware = require("../middlewares/auth/authMiddleware");
const {
  newRoomCtrl,
  findAllRoomsCtrl,
  getSingleRoom,
  joinRoomCtrl,
} = require("../controllers/roomControllers");

const roomRouter = express.Router(); // Create an instance of the Express router

roomRouter.post("/new", authMiddleware, newRoomCtrl);
roomRouter.get("/", authMiddleware, findAllRoomsCtrl);
roomRouter.get("/:id", authMiddleware, getSingleRoom);

module.exports = roomRouter;
