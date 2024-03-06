import mongoose from "mongoose";

export interface IGroupDocument {
  name: string;
  createdBy: mongoose.Types.ObjectId;
  userDetails: {
    joined_at: any;
    id: mongoose.Types.ObjectId;
    is_admin: boolean;
  }[];
  createdAt: any;
  about: string;
}
export interface IAddGroup {
  name: string;
  about: string;
}
export interface IAddGroupParticipant {
  participants: string[];
  group_id: mongoose.Types.ObjectId;
}

export interface IRemoveGroupParticipant {
  participant: string;
  group_id: mongoose.Types.ObjectId;
}
export interface IGetGroupDetails {
  group_id: string;
}
