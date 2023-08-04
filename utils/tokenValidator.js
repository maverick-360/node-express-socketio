const { verify } = require("jsonwebtoken");
const { findUserById } = require("../repositories/userRepo");

exports.tokenValidate = async (token) => {
  const decoded = verify(token, process.env.JWT_SECRET);
  //find the user by id
  const user = await findUserById(decoded.id);
  return user;
};
