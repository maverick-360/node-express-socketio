const {
  registerUserCtrl,
  loginUserCtrl,
  findAllUSersCtrl,
  findSingleUserCtrl,
  updateSingleUserCtrl,
} = require("../controllers/userControllers");
const express = require("express");
const authMiddleware = require("../middlewares/auth/authMiddleware");

const userRouter = express.Router(); // Create an instance of the Express router

userRouter.post("/register", registerUserCtrl);
userRouter.post("/login", loginUserCtrl);
userRouter.get("/", authMiddleware, findAllUSersCtrl);
userRouter.put("/", authMiddleware, updateSingleUserCtrl);
userRouter.get("/:id", authMiddleware, findSingleUserCtrl);

module.exports = userRouter;
