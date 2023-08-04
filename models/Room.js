const { Schema, model } = require("mongoose");

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Room name cannot be empty"],
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Room = model("Room", roomSchema);

module.exports = Room;
