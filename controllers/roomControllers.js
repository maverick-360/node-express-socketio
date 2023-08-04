const {
  createRoom,
  addParticipant,
  findAllRooms,
  findRoomById,
  userInRoom,
} = require("../repositories/roomRepo");
const { asyncHandler } = require("../utils/asyncHandler");
const CustomError = require("../utils/Error");
const {
  roomNameValidate,
  validateMongoDbId,
  queryInputValidate,
} = require("../utils/validation");

const newRoomCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const validatedData = await roomNameValidate(name);
  if (validatedData.error) {
    throw new CustomError(validatedData.error, 400);
  }
  const newRoom = await createRoom(name);
  res.status(201).json(newRoom);
});

const findAllRoomsCtrl = asyncHandler(async (req, res) => {
  const { offset, limit } = req.query;
  const validatedData = await queryInputValidate({ offset, limit });
  if (validatedData.error) {
    throw new CustomError(validatedData.error, 400);
  }
  const rooms = await findAllRooms(offset, limit);
  res.json(rooms);
});

const getSingleRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const validatedData = await validateMongoDbId(id);
  if (!validatedData) {
    throw new CustomError("Id not valid", 400);
  }
  const room = await findRoomById(id);
  res.json(room);
});

const joinRoomCtrl = async (userId, roomId) => {
  const validatedData = await validateMongoDbId(roomId);
  if (!validatedData) {
    throw new CustomError("Id not valid", 400);
  }
  const foundRoom = await userInRoom(userId, roomId);
  if (!foundRoom) {
    await addParticipant(roomId, userId);
    return { newJoined: true, foundRoom };
  }
  return { newJoined: false, foundRoom };
};

const userRoomCtrl = async (userId, roomId) => {
  const validatedData = await validateMongoDbId(roomId);
  if (!validatedData) {
    throw new CustomError("Id not valid", 400);
  }
  const foundRoom = await userInRoom(userId, roomId);
  if (!foundRoom) {
    throw new CustomError(`User ${userId} not in this room`, 403);
  }
  return foundRoom;
};

module.exports = {
  newRoomCtrl,
  findAllRoomsCtrl,
  getSingleRoom,
  joinRoomCtrl,
  userRoomCtrl,
};
