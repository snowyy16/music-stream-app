import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
}, { timestamps: true });

// ✅ Nếu model đã tồn tại thì dùng lại, tránh OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
