import { IBaseResponse } from "./baseRespo.interface";

export interface IChatResponse extends IBaseResponse {
  data: IChatData[];
}

export interface IChatData {
  _id: string;
  sent_to: string;
  sent_from: string;
  message_type?: string;
  file_url?: string;
  width?: number;
  height?: number;
  message: string;
  isReaded: boolean;
  chatType?: "Group" | "Personal";
  date: string;
  __v: number;
}
