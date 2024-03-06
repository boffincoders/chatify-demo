import { ISendChatMessage } from "../interfaces/request/chat.interface";
import {
  IAddGroupParticipants,
  ICreateGroupPayload,
} from "../interfaces/request/group.interface";
import { ILogin } from "../interfaces/request/login.interface";
import { IBaseResponse } from "../interfaces/response/baseRespo.interface";
import { IChatResponse } from "../interfaces/response/chats.interface";
import { IMyGroupsResponse } from "../interfaces/response/groupRespo.interface";
import { IGroupUsersResponse } from "../interfaces/response/groupUsersRespo.interface";
import { ISignInUserResponse } from "../interfaces/response/signInUser.interface";
import { IUsersResponse } from "../interfaces/response/users.Respo.interafce";
import baseInstance from "../utils/baseInstance";

class ChatAppServices {
  login = async (data: ILogin): Promise<ISignInUserResponse> => {
    return await baseInstance
      .post("/auth/signIn", data)
      .then((res) => res.data)
      .catch((err) => err);
  };
  signUp = async (data: ILogin): Promise<IBaseResponse> => {
    return await baseInstance
      .post("/auth/signUp", data)
      .then((res) => res.data)
      .catch((err) => err);
  };
  getUsers = async (): Promise<IUsersResponse> => {
    return await baseInstance
      .get("/users")
      .then((res) => res.data)
      .catch((err) => err);
  };
  getChats = async (id: string): Promise<IChatResponse> => {
    return await baseInstance
      .get(`/chat/message?chatUserId=${id}`)
      .then((res) => res.data)
      .catch((err) => err);
  };
  sendMessage = async (data: ISendChatMessage) => {
    return await baseInstance
      .post("/chat/message", data)
      .then((res) => res.data)
      .catch((err) => err);
  };
  createGroup = async (payload: ICreateGroupPayload) => {
    return await baseInstance
      .post("/group", payload)
      .then((res) => res.data)
      .catch((err) => err);
  };
  getMygroups = async (): Promise<IMyGroupsResponse> => {
    return await baseInstance
      .get("/group")
      .then((res) => res.data)
      .catch((err) => err);
  };
  addParticipant = async (payload: IAddGroupParticipants) => {
    return await baseInstance
      .post("/group/participant", payload)
      .then((res) => res.data)
      .catch((err) => err);
  };
  getGroupDetail = async (id: string): Promise<IGroupUsersResponse> => {
    return await baseInstance
      .get(`/group/details?group_id=${id}`)
      .then((res) => res.data)
      .catch((err) => err);
  };
  getGroupChats = async (groupId: string): Promise<IChatResponse> => {
    return baseInstance
      .get(`/chat/group?groupId=${groupId}`)
      .then((res) => res.data)
      .catch((err) => err);
  };
  updateUserProfile = (data: any): Promise<ISignInUserResponse> => {
    return baseInstance
      .put("/users", data)
      .then((res) => res.data)
      .catch((err) => err);
  };
  uploadImage = (formData: FormData) => {
    return baseInstance
      .post("/chat/upload-media", formData)
      .then((res) => res.data)
      .catch((err) => err);
  };
  getAvailableUsersForGroup = async (
    group_id: string
  ): Promise<any> => {
    return await baseInstance
      .get(`/group/users/${group_id}`)
      .then((res) => res.data)
      .catch((err) => err);
  };
}

const services = new ChatAppServices();
export default services