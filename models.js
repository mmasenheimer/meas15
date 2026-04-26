const mongoose = require("mongoose");

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  group: {type: String}
});

// Trip schema
const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pointValue: { type: Number, required: true },
  date: { type: String, required: true }, // e.g. "2024-04-25"
  time: { type: String, required: true }, // e.g. "14:32"
});

// Group schema
const groupSchema = new mongoose.Schema({
  name: { type: String, required: true }
  //groupId: { type: String, required: true, unique: true }
});

// User to group schema
const userToGroupSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
});

module.exports = {
  User: mongoose.model("User", userSchema),
  Trip: mongoose.model("Trip", tripSchema),
  Group: mongoose.model("Group", groupSchema),
  UserToGroup: mongoose.model("UserToGroup", userToGroupSchema),
};
// This exports the models so other files can use them
