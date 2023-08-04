const Message = require("../models/Message");

const createMessage = async ({ senderId, receiverId, message, roomId }) => {
  return await Message.create({
    content: message,
    sender: senderId,
    receiver: receiverId,
    room: roomId,
  });
};

const getAllPrivateMessages = async (id, offset, limit) => {
  return await Message.find(
    { room: null, $or: [{ sender: id }, { receiver: id }] },
    {},
    { skip: offset, limit }
  ).sort({ createdAt: "desc" });
};

const getAllRoomMessages = async (roomId, offset, limit) => {
  return await Message.find({ room: roomId }, {}, { skip: offset, limit }).sort(
    { createdAt: "desc" }
  );
};

module.exports = { createMessage, getAllPrivateMessages, getAllRoomMessages };
