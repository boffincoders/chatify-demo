import mongoose from "mongoose";
import common from "../common";
import {
  IAddGroup,
  IAddGroupParticipant,
  IGetGroupDetails,
  IRemoveGroupParticipant,
} from "../interfaces/group/group.interface";
import { ChatModel } from "../model/chat.model";
import { GroupModel } from "../model/groups.model";
import { UserModel } from "../model/user.model";
import { SocketModel } from "../model/socket.model";
import { io } from "..";

const createGroup = async (user: any, body: IAddGroup) => {
  let { name, about } = body;
  try {
    await GroupModel.create({
      createdAt: new Date(),
      createdBy: new mongoose.Types.ObjectId(user._id),
      userDetails: [
        {
          id: new mongoose.Types.ObjectId(user._id),
          joined_date: new Date(),
          is_admin: true,
        },
      ],
      name,
      about,
    });

    return common.successRequest({ success: true });
  } catch (error) {
    return common.internalServerError();
  }
};

const getMyGroups = async (user: any) => {
  try {
    let foundUser = await UserModel.findOne({ _id: user._id });
    if (!foundUser) return common.internalServerError();

    let foundUserGroups = await GroupModel.find({
      userDetails: {
        $elemMatch: { id: foundUser._id },
      },
    })
      .populate("userDetails.id")
      .lean();

    let updatedGroupsWithUnreadMessages = await Promise.all(
      foundUserGroups.map(async (allGroups) => {
        let countUnreadMessages = await ChatModel.countDocuments({
          chatType: "Group",
          sent_to: allGroups._id,
          sent_from: { $ne: user._id },
          isReadedBy: { $nin: [user._id] },
        });
        return {
          ...allGroups,
          unreadMessages: countUnreadMessages,
        };
      })
    );
    return common.successRequest(updatedGroupsWithUnreadMessages);
  } catch (error) {
    return common.internalServerError();
  }
};

const getGroupDetails = async (user: any, params: IGetGroupDetails) => {
  let { group_id } = params;
  try {
    let foundGroup = await GroupModel.findOne({ _id: group_id })
      .populate("userDetails.id")
      .lean();

    let isUserExists = foundGroup?.userDetails.find(
      (allUsers) => allUsers.id._id.toString() === user._id.toString()
    );

    if (!isUserExists)
      return common.badRequest(
        "You are not authorized to access details of this group"
      );

    return common.successRequest(foundGroup);
  } catch (error) {
    return common.internalServerError();
  }
};

const addParticipantGroup = async (user: any, body: IAddGroupParticipant) => {
  try {
    let { group_id, participants } = body;
    let foundExistingGroup = await GroupModel.findById(group_id);

    if (!foundExistingGroup) return common.internalServerError();

    let checkAdmin = foundExistingGroup.userDetails.find(
      (_user) => _user.id.toString() === user._id.toString() && _user.is_admin
    );

    if (!checkAdmin)
      return common.badRequest(
        "You are not authorized to add participant in this group"
      );

    if (!foundExistingGroup) return common.internalServerError();
    let existingUsers = foundExistingGroup.userDetails.map((existingUser) =>
      existingUser.id.toString()
    );

    let filteredParticipants = participants
      .map((participant) => {
        if (!existingUsers.includes(participant.toString())) return participant;
      })
      .filter((x) => x);

    let toBeAddedUsers = filteredParticipants.map((participant) => {
      return {
        id: participant,
        is_admin: false,
        joined_at: new Date(),
      };
    });
    let foundSocketsInDB = await SocketModel.find({
      user_id: {
        $in: filteredParticipants,
      },
    });
    await Promise.all(
      foundSocketsInDB.map(async (dbSocket) => {
        await Promise.all(
          dbSocket.socket_id.map(async (socket) => {
            let _socket = io.sockets.sockets.get(socket);
            if (_socket) _socket.join(foundExistingGroup?._id?.toString()!);
          })
        );
      })
    );

    await GroupModel.findByIdAndUpdate(foundExistingGroup._id, {
      $push: {
        userDetails: {
          $each: toBeAddedUsers,
          $position: 0,
        },
      },
    });
    return common.successRequest();
  } catch (error) {
    return common.internalServerError();
  }
};

const removeParticipantGroup = async (
  user: any,
  body: IRemoveGroupParticipant
) => {
  try {
    let { group_id, participant } = body;
    let foundExistingGroup = await GroupModel.findById(group_id);
    if (!foundExistingGroup) return common.internalServerError();
    let checkAdmin = foundExistingGroup.userDetails.find(
      (_user) => _user.id.toString() === user._id.toString() && _user.is_admin
    );
    if (!checkAdmin)
      return common.badRequest(
        "You are not authorized to remove participant in this group"
      );
    if (!foundExistingGroup) return common.internalServerError();

    let result = await GroupModel.findByIdAndUpdate(foundExistingGroup._id, {
      $pull: {
        "userDetails.id": {
          $eq: new mongoose.Types.ObjectId(participant),
        },
      },
    }).lean();
    return common.successRequest(result);
  } catch (error) {
    return common.internalServerError();
  }
};

const fetchAvailableUsersForGroup = async (body: IRemoveGroupParticipant) => {
  try {
    let { group_id } = body;
    let foundExistingGroup = await GroupModel.findById(group_id);
    if (!foundExistingGroup) return common.internalServerError();
    let existingUsers = foundExistingGroup.userDetails.map((_user) => _user.id);

    let foundAllUsers = await UserModel.find(
      {
        _id: { $nin: existingUsers },
      },
      {
        password: 0,
      }
    );

    return common.successRequest({ users: foundAllUsers });
  } catch (error) {
    return common.internalServerError();
  }
};
export default {
  createGroup,
  getMyGroups,
  addParticipantGroup,
  getGroupDetails,
  removeParticipantGroup,
  fetchAvailableUsersForGroup,
};
