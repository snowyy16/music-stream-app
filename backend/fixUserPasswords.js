import mongoose from "mongoose";
import bcrypt from "bcryptjs";

mongoose.connect("mongodb://127.0.0.1:27017/musicdb");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

const fixPasswords = async () => {
  const users = await User.find();
  for (const user of users) {
    // chỉ hash nếu password chưa hash
    if (!user.password.startsWith("$2a$")) {
      const hashed = await bcrypt.hash(user.password, 10);
      user.password = hashed;
      await user.save();
      console.log(`✅ Đã hash lại mật khẩu cho: ${user.email}`);
    }
  }
  console.log("✨ Hoàn tất!");
  process.exit();
};

fixPasswords();
