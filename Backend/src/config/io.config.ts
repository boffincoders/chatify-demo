import mongoose from "mongoose";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { RoomModel } from "../model/room.model";
import { SocketModel } from "../model/socket.model";
import { UserModel } from "../model/user.model";
import chatService from "../services/chat.service";
import { GroupModel } from "../model/groups.model";

const ioStrategy = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  io.on("connection", async (socket) => {
    let request: any = socket.request;
    let { _id } = request._query;
    let findUser = await UserModel.findById(_id).lean();

    if (_id) {
      // Save User Sockets In Db
      await SocketModel.findOneAndUpdate(
        {
          user_id: new mongoose.Types.ObjectId(_id),
        },
        {
          $addToSet: {
            socket_id: socket.id,
          },
        },
        {
          upsert: true,
        }
      );
      // Join all personal chats 
      let foundUserRooms = await RoomModel.find({ users: { $in: _id } }).lean();
      let foundGroups = await GroupModel.find({
        "userDetails.id": { $in: _id },
      }).lean();
      foundGroups.map((group) => socket.join(group._id.toString()));
      foundUserRooms.forEach((allRooms) => {
        socket.join(allRooms._id.toString());
      });
      socket.on("personalMessage", (arg: any) => {
        chatService.sendMessageSocketService(findUser, socket, arg);
      });
    }

    socket.on("startChat", async (arg: any) => {
      let { id, userId } = arg;
      let foundUserRoom = await RoomModel.findOne({
        users: {
          $all: [
            new mongoose.Types.ObjectId(id),
            new mongoose.Types.ObjectId(userId),
          ],
        },
        chatType: "personal",
      }).lean();
      if (!foundUserRoom)
        foundUserRoom = await RoomModel.create({
          chatType: "personal",
          users: [id, userId],
        });
      if (foundUserRoom) {
        socket.join(foundUserRoom?._id.toString()); //my socket
        let socketsOfOtherUser = await SocketModel.find({
          user_id: new mongoose.Types.ObjectId(userId),
        });
        //other person's sockets
        socketsOfOtherUser.forEach((_sockets) => {
          _sockets.socket_id.forEach((id) => {
            //finding all sockets of other person
            io.sockets.sockets.forEach((_socket) => {
              // checking if other user is also connected right now or not?
              // if exists then join created room
              if (id === _socket.id) {
                _socket.join(foundUserRoom!._id.toString());
              }
            });
          });
        });
      }
    });
  });
};
export default ioStrategy;
