const mongoose = require("mongoose");

const { Schema } = mongoose;

const profileSchema = Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    first_name: { type: String },
    last_name: { type: String },
    address: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    gender: { type: String, enum: ["m", "f", "o"], default: "m" },
    is_active: { type: String, enum: ["1", "0"], default: "1" }
  },
  { collection: "userProfile" }
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
