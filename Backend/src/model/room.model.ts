import mongoose, { model } from "mongoose";
import { IRoomModelDocument } from "../interfaces/room";
import { UserModel } from "./user.model";

const RoomSchema = new mongoose.Schema(
  {
    users: { type: [mongoose.Types.ObjectId], ref: UserModel },
    chatType: { type: String },
  },
  { timestamps: true }
);
export const RoomModel = model<IRoomModelDocument>("rooms", RoomSchema);
