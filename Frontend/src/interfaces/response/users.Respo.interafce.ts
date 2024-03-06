import { IBaseResponse } from "./baseRespo.interface";

export interface IUsersResponse extends IBaseResponse {
  data: IUsersData[];
}

export interface IUsersData {
  _id: string;
  email: string;
  isSelected?: boolean;
  password: string;
  unreadMessages?: number;
  name: string;
  last_login: string;
  createdAt: string;
  __v: number;
  unReadedMessages: number;
  profile?: string;
}
