import { model, Schema } from "mongoose";

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  profilePic: { type: String, default: "" },
  bio: { type: String, default: "" },
},{ timestamps: true });

const User = model("User", userSchema);

export default User;
