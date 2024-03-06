import { IBaseResponse } from "./baseRespo.interface";

export interface ISignInUserResponse extends IBaseResponse {
  data: ISignInUserData;
}

export interface ISignInUserData {
  _id: string;
  email: string;
  createdAt: string;
  profile: string;
  name: string;
  last_login: Date | null;
  __v: number;
}
