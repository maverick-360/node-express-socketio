const Joi = require("joi");
const { Types } = require("mongoose");

const registerUserSchema = Joi.object({
  firstName: Joi.string().min(1).required().label("First Name"),
  lastName: Joi.string().min(1).required().label("Last Name"),
  email: Joi.string().email().required().label("Email"),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
    .required()
    .label("Password")
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one digit.",
    }),
});

const loginUserSchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
    .required()
    .label("Password")
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one digit.",
    }),
});

const findUsersQuerySchema = Joi.object({
  offset: Joi.number().label("Offset"),
  limit: Joi.number().label("Limit"),
});

const roomNameSchema = Joi.string().required().min(3).max(16).label("Name");

const messageSchema = Joi.string().required().max(50).label("Message");

exports.registerUserValidate = async (userData) => {
  const value = registerUserSchema.validate(userData);
  return value;
};

exports.loginUserValidate = async (userData) => {
  const value = loginUserSchema.validate(userData);
  return value;
};

exports.queryInputValidate = async (params) => {
  const value = findUsersQuerySchema.validate(params);
  return value;
};

exports.validateMongoDbId = async (id) => {
  const isValid = Types.ObjectId.isValid(id);
  return isValid;
};

exports.roomNameValidate = async (name) => {
  const value = roomNameSchema.validate(name);
  return value;
};

exports.newMessageValidate = async (message) => {
  const value = messageSchema.validate(message);
  return value;
};
