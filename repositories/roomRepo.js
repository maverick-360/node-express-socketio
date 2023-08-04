const Room = require("../models/Room");

const createRoom = async (name) => {
  return await Room.create({ name });
};

const addParticipant = async (roomId, userId) => {
  return await Room.findByIdAndUpdate(roomId, {
    $push: { users: userId },
  });
};

const findAllRooms = async (offset, limit) => {
  return await Room.find({}, {}, { skip: offset, limit });
};

const findRoomById = async (id) => {
  return await Room.findById(id).populate(
    "users",
    "firstName lastName email profilePhoto"
  );
};

const userInRoom = async (userId, roomId) => {
  return await Room.findOne({ _id: roomId, users: { $in: [userId] } });
};

module.exports = {
  createRoom,
  addParticipant,
  findAllRooms,
  findRoomById,
  userInRoom,
};
