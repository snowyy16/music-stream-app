import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  avatar: {
    type: String,
    default: "https://picsum.photos/200/200",
  },
}, { timestamps: true });


export default mongoose.model("User", userSchema);
