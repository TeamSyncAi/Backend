// userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  chatID: {
    type: String,
    required: true,
    unique: true, // Assuming chatID should be unique
  },
});

const User = mongoose.model("User", userSchema);
export default User;
