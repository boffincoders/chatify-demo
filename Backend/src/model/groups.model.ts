import mongoose, { model } from "mongoose";
import { IGroupDocument } from "../interfaces/group/group.interface";
import { UserModel } from "./user.model";

const GroupSchema = new mongoose.Schema({
  userDetails: [
    {
      joined_at: { type: Date },
      id: { type: mongoose.Types.ObjectId, ref: UserModel },
      is_admin: { type: Boolean, default: false },
    },
  ],
  createdBy: mongoose.Types.ObjectId,
  name: String,
  about: String,
  createdAt: { type: Date, default: new Date() },
});
export const GroupModel = model<IGroupDocument>("groups", GroupSchema);
