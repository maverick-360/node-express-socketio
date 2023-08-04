const { asyncHandler } = require("../../utils/asyncHandler");
const CustomError = require("../../utils/Error");
const { tokenValidate } = require("../../utils/tokenValidator");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new CustomError("There is no token attached to the header", 400);
  }
  req.user = await tokenValidate(token);
  next();
});

module.exports = authMiddleware;
