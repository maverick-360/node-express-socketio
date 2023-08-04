const {
  findUserByEmail,
  createUser,
  findAllUsers,
  findUserById,
  updateUserById,
} = require("../repositories/userRepo");
const { asyncHandler } = require("../utils/asyncHandler");
const CustomError = require("../utils/Error");
const {
  registerUserValidate,
  loginUserValidate,
  queryInputValidate,
  validateMongoDbId,
} = require("../utils/validation");

const registerUserCtrl = asyncHandler(async (req, res) => {
  const userData = req.body;
  // Validate user inputs
  const validatedData = await registerUserValidate(userData);
  if (validatedData.error) {
    throw new CustomError(validatedData.error, 400);
  }

  // Check if the email is already registered
  const existingUser = await findUserByEmail(userData.email);
  if (existingUser) {
    throw new CustomError("Email already exists", 400);
  }

  // Create the new user
  const newUser = await createUser(userData);
  newUser.password = undefined;

  // Generate a signed JWT token
  const token = await newUser.getSignedJwtToken();

  // Return the token and any other relevant user data
  res.status(201).json({ token, user: newUser });
});

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // VAlidate user inputs
  const validatedData = await loginUserValidate({ email, password });
  if (validatedData.error) {
    throw new CustomError(validatedData.error, 400);
  }

  // Find the user by email
  const user = await findUserByEmail(email);
  if (!user) {
    throw new CustomError("No user found", 400);
  }

  // Verify the password
  const isPasswordMatched = await user.isPasswordMatched(password);
  if (!isPasswordMatched) {
    throw new CustomError("Invalid password", 400);
  }
  user.password = undefined;

  // Generate and send the signed JWT token upon successful login
  const token = await user.getSignedJwtToken();
  res.json({ token, user });
});

const findAllUSersCtrl = asyncHandler(async (req, res) => {
  const { offset, limit } = req.query;
  const validatedData = await queryInputValidate({ offset, limit });
  if (validatedData.error) {
    throw new CustomError(validatedData.error, 400);
  }
  const users = await findAllUsers(offset, limit);
  if (users.length < 1) {
    throw new CustomError("No users found", 400);
  }
  res.json(users);
});

const findSingleUserCtrl = asyncHandler(async (req, res) => {
  const cacheKey = `users:${req.originalUrl}`;
  const { id } = req.params;
  const validatedData = await validateMongoDbId(id);
  if (!validatedData) {
    throw new CustomError("Id not valid", 400);
  }
  const cachedUser = await redisClient.get(cacheKey);
  if (cachedUser) {
    // If data exists in the cache, return it
    const parsedUsers = JSON.parse(cachedUser);
    return res.json(parsedUsers);
  } else {
    const user = await findUserById(id);
    await redisClient.set(cacheKey, JSON.stringify(user));
    await redisClient.expire(cacheKey, 3600);
    res.json(user);
  }
});

const updateSingleUserCtrl = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const data = req.body;
  const user = await updateUserById(id, data);
  res.json(user);
});

module.exports = {
  registerUserCtrl,
  loginUserCtrl,
  findAllUSersCtrl,
  findSingleUserCtrl,
  updateSingleUserCtrl,
};
