const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "Message body cannot be empty"],
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
  },
  {
    timestamps: true,
  }
);

const Message = model("Message", messageSchema);

module.exports = Message;
