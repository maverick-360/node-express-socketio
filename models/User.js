const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");
const { genSalt, hash, compare } = require("bcryptjs");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name of the user is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name of the user is required"],
    },
    email: {
      type: String,
      required: [true, "Email of the user is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profilePhoto: {
      type: String,
      default: "https://img.freepik.com/free-icon/user_318-563642.jpg",
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

//Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  try {
    //hash password
    const salt = await genSalt(10);
    const hashedPassword = await hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

//match password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

//Get Signed JWT token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
};

//Password reset/forget
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 15 * 60 * 1000; //15 minutes
  return resetToken;
};

const User = model("User", userSchema);

module.exports = User;
