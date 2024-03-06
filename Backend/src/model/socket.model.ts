import mongoose, { model } from "mongoose";
import { ISocketModelDocument } from "../interfaces/socket/socketModel.interface";

const SocketSchema = new mongoose.Schema({
  user_id: mongoose.Types.ObjectId,
  socket_id: Array,
});
export const SocketModel = model<ISocketModelDocument>("socket", SocketSchema);
