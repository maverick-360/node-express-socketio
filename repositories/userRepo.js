const User = require("../models/User");

const createUser = async (userData) => {
  return await User.create(userData);
};

const findUserByEmail = async (email) => {
  return await User.findOne(
    { email },
    { message: 0, createdAt: 0, updatedAt: 0, __v: 0 }
  );
};

const findAllUsers = async (offset, limit) => {
  return await User.find(
    {},
    { firstName: 1, lastName: 1, email: 1, profilePhoto: 1 },
    { skip: offset, limit }
  ).sort({ createdAt: "desc" });
};

const findUserById = async (id) => {
  return await User.findById(id, {
    email: 1,
    firstName: 1,
    lastName: 1,
    profilePhoto: 1,
  });
};

const updateUserById = async (id, { firstName, lastName, profilePhoto }) => {
  return await User.findByIdAndUpdate(
    { _id: id },
    { firstName, lastName, profilePhoto }
  );
};

module.exports = {
  createUser,
  findUserByEmail,
  findAllUsers,
  findUserById,
  updateUserById,
};
