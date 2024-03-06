import { IBaseResponse } from "./baseRespo.interface";

export interface IGroupUsersResponse extends IBaseResponse {
  data: IGroupUsersData;
}

export interface IGroupUsersData {
  _id: string;
  userDetails: UserDetail[];
  createdBy: string;
  name: string;
  about: string;
  createdAt: string;
  __v: number;
}

export interface UserDetail {
  joined_at?: string;
  id: Id;
  _id: string;
  is_admin: boolean;
}
export interface Id {
  _id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
  __v: number;
}
