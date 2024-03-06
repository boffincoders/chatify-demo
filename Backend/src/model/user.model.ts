import mongoose, { model } from "mongoose";
import { IUserModelDocument } from "../interfaces/user/userModel.interface";

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  profile: String,
  name: String,
  last_login: { type: Date, default: null },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
export const UserModel = model<IUserModelDocument>("user", UserSchema);
