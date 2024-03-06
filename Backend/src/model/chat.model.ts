import mongoose, { model } from "mongoose";
import { IChatModelDocument } from "../interfaces/chat/chat.interface";
import { UserModel } from "./user.model";
export enum ChatType {
  PERSONAL = "Personal",
  GROUP = "Group",
}
const ChatSchema = new mongoose.Schema({
  sent_to: mongoose.Types.ObjectId,
  sent_from: { type: mongoose.Types.ObjectId, ref: UserModel },
  message: String,
  message_type: String,
  file_url: String,
  isReadedBy: { type: [mongoose.Types.ObjectId] },
  chatType: { default: ChatType.PERSONAL, type: String },
  date: { type: Date, default: new Date() },
});
export const ChatModel = model<IChatModelDocument>("chats", ChatSchema);
