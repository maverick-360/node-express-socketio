require("dotenv").config();
const cors = require("cors");
const { reqLogger, logger } = require("./utils/logger");
const { notFound, errorHandler } = require("./middlewares/error/errorHandler");
const connectDb = require("./config/db");
const {
  createMessageCtrl,
  createRoomMessageCtrl,
} = require("./controllers/messageController");
const { joinRoomCtrl, userRoomCtrl } = require("./controllers/roomControllers");
const redisClient = require("./config/redis");
const { tokenValidate } = require("./utils/tokenValidator");
const { userRouter, roomRouter, messageRouter } = require("./routes");
const express = require("express");
const http = require("http");
const Emitter = require("events");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    credentials: true,
  },
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(async (req, res, next) => {
  await reqLogger(req, res);
  next();
}); // Logger
const eventEmitter = new Emitter(); // Event emitter
app.set("eventEmitter", eventEmitter);

// Routes
app.get("/", (req, res) => {
  res.status(200).json("This api is working");
});
app.use("/users", userRouter);
app.use("/rooms", roomRouter);
app.use("/messages", messageRouter);

const users = {};

// Socket
io.on("connection", async (socket) => {
  const { _id, firstName, lastName, email } = await tokenValidate(
    socket.handshake?.query?.token
  );
  users[_id] = socket.id;

  socket.on("privateMessage", async ({ receiverId, message }) => {
    try {
      const { content, createdAt } = await createMessageCtrl({
        senderId: _id,
        receiverId,
        message,
      });
      io.to(users[receiverId]).to(users[_id]).emit("privateMessage", {
        senderId: _id,
        firstName,
        lastName,
        email,
        message: content,
        createdAt,
      });
    } catch (error) {
      io.to(users[_id]).emit("socketError", {
        message: error.message,
        statusCode: error.statusCode,
      });
    }
  });

  socket.on("joinRoom", async (roomId) => {
    try {
      await joinRoomCtrl(_id, roomId);
      socket.join(roomId);
      io.to(roomId).emit(
        `userJoined`,
        `${firstName} ${lastName} has joined this room`
      );
    } catch (error) {
      io.to(users[_id]).emit("socketError", {
        message: error.message,
        statusCode: error.statusCode,
      });
    }
  });

  socket.on("roomMessage", async ({ message, roomId }) => {
    try {
      await userRoomCtrl(_id, roomId);
      const { content, createdAt } = await createRoomMessageCtrl({
        senderId: _id,
        roomId,
        message,
      });
      io.to(roomId).emit("roomMessage", {
        senderId: _id,
        firstName,
        lastName,
        email,
        message: content,
        createdAt,
      });
    } catch (error) {
      io.to(users[_id]).emit("socketError", {
        message: error.message,
        statusCode: error.statusCode,
      });
    }
  });

  socket.on("disconnect", () => {
    for (const [mongoId, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[mongoId];
        break; // Exit the loop once we find and delete the entry
      }
    }
  });
});

app.use(notFound); // Handle 404 errors
app.use(errorHandler); // Handle other errors using custom error handling middleware

connectDb(process.env.MONGO_URI);
redisClient.connect();

server.listen(process.env.PORT, () => {
  logger.info(
    `Server started on http://localhost:${process.env.PORT} and Worker: ${process.pid} and Environment: ${process.env.NODE_ENV}`
  ); // Start the server and log the server information
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err); // Handle uncaught exceptions and log the error
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Promise Rejection:", reason); // Handle unhandled promise rejections and log the error
  process.exit(1);
});
