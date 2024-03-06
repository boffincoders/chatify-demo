import mongoose from "mongoose";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { io } from "..";
import common from "../common";
import { IChatModelDocument } from "../interfaces/chat/chat.interface";
import { ChatModel } from "../model/chat.model";
import { GroupModel } from "../model/groups.model";
import { RoomModel } from "../model/room.model";
import { SocketModel } from "../model/socket.model";
import { UserModel } from "../model/user.model";
import { UploadedFile } from "express-fileupload";

const sendMessage = async (user: any, body: IChatModelDocument) => {
  let { message, sent_to, chatType } = body;

  try {
    if (chatType === "Group") {
      let userDetails = await UserModel.findById(user._id).lean();
      let foundGroup = await GroupModel.findById(sent_to);
      if (!foundGroup)
        return common.badRequest(
          "You are not authoirized to send message in this group"
        );
      await ChatModel.create({
        message: message,
        sent_from: user._id,
        sent_to: foundGroup._id,
        chatType: "Group",
      });
      io.to(foundGroup._id.toString())
        .emit("groupMessage", { sent_from: userDetails, message });

      return common.successRequest({ success: true });
    }
    let foundUser = await UserModel.findById(
      new mongoose.Types.ObjectId(sent_to)
    ).lean();

    if (!foundUser)
      return common.badRequest(
        "This user does not exist or deleted their account"
      );

    await ChatModel.create({
      message: message,
      sent_from: user._id,
      sent_to: foundUser._id,
    });
    let findSocketUser = await SocketModel.findOne({ user_id: foundUser._id });
    io.sockets.sockets.forEach((onlineSockets) => {
      findSocketUser?.socket_id.forEach((allSocketsUser) => {
        if (allSocketsUser.toString() === onlineSockets.id.toString()) {
          onlineSockets.emit("chatMessage", {
            message: message,
            id: user._id,
          });
        }
      });
    });
    return common.successRequest({ success: true });
  } catch (error) {
    return common.internalServerError();
  }
};
const sendMessageSocketService = async (
  user: any,
  _socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  body: any
) => {
  let { message, sent_to, chatType, message_type, file_url } = body;
  try {
    if (chatType === "Group") {
      let userDetails = await UserModel.findById(user._id).lean();
      let foundGroup = await GroupModel.findById(sent_to);
      if (!foundGroup)
        return common.badRequest(
          "You are not authoirized to send message in this group"
        );
      await ChatModel.create({
        message: message,
        message_type,
        file_url,
        sent_from: user._id,
        sent_to: foundGroup._id,
        chatType: "Group",
      });
      _socket.to(foundGroup._id.toString()).emit("groupMessage", {
        sent_from: userDetails,
        message,
        message_type,
        sent_to: foundGroup._id,
        file_url,
        group_name:foundGroup.name
      });

      return common.successRequest({ success: true });
    } 
    else {
      let foundUser = await UserModel.findById(
        new mongoose.Types.ObjectId(sent_to)
      ).lean();
      if (!foundUser)
        return common.badRequest(
          "This user does not exist or deleted their account"
        );

      await ChatModel.create({
        message: message,
        message_type,
        file_url,
        sent_from: user._id,
        sent_to: foundUser._id,
      });

      let foundUserRoom = await RoomModel.findOne({
        users: { $all: [foundUser._id, user._id] },
      }).lean();

      if (foundUserRoom)
        _socket.to(foundUserRoom._id.toString()).emit("chatMessage", {
          sent_from: user,
          message,
          message_type,
          sent_to: foundUserRoom._id,
          file_url,
        });
      return common.successRequest({ success: true });
    }
  } catch (error) {
    return common.internalServerError();
  }
};

const getPersonalChats = async (user: any, body: any) => {
  let { chatUserId } = body;
  let foundUserRoom = await RoomModel.findOne(
    {
      users: {
        $all: [
          new mongoose.Types.ObjectId(chatUserId),
          new mongoose.Types.ObjectId(user._id),
        ],
      },
    },
    { upsert: true }
  );

  if (!foundUserRoom)
    await RoomModel.create({
      chatType: "personal",
      users: [chatUserId, user._id],
    });

  let findChat = await ChatModel.find({
    $or: [
      {
        sent_from: chatUserId,
        sent_to: user._id,
      },
      {
        sent_from: user._id,
        sent_to: chatUserId,
      },
    ],
  }).lean();

  findChat.forEach(
    async (chats) =>
      await ChatModel.findByIdAndUpdate(chats._id, {
        $addToSet: { isReadedBy: [user._id] },
      })
  );
  return common.successRequest(findChat);
};
const getGroupChats = async (user: any, params: any) => {
  const { groupId } = params;
  try {
    let groupExists = await GroupModel.findById(groupId);
    if (!groupExists) return common.badRequest("Group not exists");

    let groupChats = await ChatModel.find({
      sent_to: groupExists._id,
      chatType: "Group",
    }).populate("sent_from");

    groupChats.forEach(
      async (allgroups) =>
        await ChatModel.findByIdAndUpdate(allgroups._id, {
          $addToSet: {
            isReadedBy: [user._id],
          },
        })
    );
    return common.successRequest(groupChats);
  } catch (error) {
    return common.internalServerError();
  }
};
const uploadMediaService = async (file: UploadedFile) => {
  try {
    let uploadedResponse = await common.uploadImage({
      buffer: file.data,
      fieldname: file.name,
      mimetype: file.mimetype,
      originalname: file.name,
      size: file.size,
    });

    return common.successRequest({
      uploadedFileUrl: uploadedResponse,
    });
  } catch (error) {
    return common.internalServerError();
  }
};
export default {
  sendMessage,
  getPersonalChats,
  getGroupChats,
  sendMessageSocketService,
  uploadMediaService,
};
