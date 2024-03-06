import mongoose from "mongoose";
import { ChatType } from "../../model/chat.model";

export interface IRoomModelDocument {
  users: mongoose.Types.ObjectId[];
  chatType: ChatType;
}
