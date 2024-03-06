export interface IMyGroupsResponse {
  statusCode: number;
  data: IMyGroupsData[];
  success: boolean;
}

export interface IMyGroupsData {
  _id: string;
  userDetails: UserDetail[];
  createdBy: string;
  name: string;
  about: string;
  createdAt: string;
  __v: number;
  isSelected?: boolean;
  unreadMessages?: number;
}

export interface UserDetail {
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
