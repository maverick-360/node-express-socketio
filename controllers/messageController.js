const {
  createMessage,
  getAllPrivateMessages,
  getAllRoomMessages,
} = require("../repositories/messageRepo");
const { userInRoom } = require("../repositories/roomRepo");
const CustomError = require("../utils/Error");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  validateMongoDbId,
  newMessageValidate,
  queryInputValidate,
} = require("../utils/validation");

const createMessageCtrl = async (data) => {
  try {
    const validatedSender = await validateMongoDbId(data.senderId);
    const validatedReciever = await validateMongoDbId(data.receiverId);
    if (!validatedSender || !validatedReciever) {
      throw new CustomError("Id not valid", 400);
    }
    const validatedMessage = await newMessageValidate(data.message);
    if (validatedMessage.error) {
      throw new CustomError(validatedMessage.error, 400);
    }
    const newMessage = await createMessage(data);
    return newMessage;
  } catch (error) {
    throw error;
  }
};

const createRoomMessageCtrl = async (data) => {
  try {
    const validatedSender = await validateMongoDbId(data.senderId);
    const validatedRoom = await validateMongoDbId(data.roomId);
    if (!validatedSender || !validatedRoom) {
      throw new CustomError("Id not valid", 400);
    }
    const validatedMessage = await newMessageValidate(data.message);
    if (validatedMessage.error) {
      throw new CustomError(validatedMessage.error, 400);
    }
    const newMessage = await createMessage(data);
    return newMessage;
  } catch (error) {
    throw error;
  }
};

const getAllPrivateMessagesCtrl = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { offset, limit } = req.query;
  const validatedData = await queryInputValidate({ offset, limit });
  if (validatedData.error) {
    throw new CustomError(validatedData.error, 400);
  }
  const messages = await getAllPrivateMessages(_id, offset, limit);
  res.json(messages);
});

const getAllRoomMessagesCtrl = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { offset, limit } = req.query;
  const { roomId } = req.params;
  const validatedData = await queryInputValidate({ offset, limit });
  if (validatedData.error) {
    throw new CustomError(validatedData.error, 400);
  }
  const validatedRoom = await validateMongoDbId(roomId);
  if (!validatedRoom) {
    throw new CustomError("Id not valid", 400);
  }

  const foundRoom = await userInRoom(_id, roomId);
  if (!foundRoom) {
    throw new CustomError("User does not exist in this room", 403);
  }
  const messages = await getAllRoomMessages(roomId, offset, limit);
  res.json(messages);
});

module.exports = {
  createMessageCtrl,
  getAllPrivateMessagesCtrl,
  createRoomMessageCtrl,
  getAllRoomMessagesCtrl,
};
