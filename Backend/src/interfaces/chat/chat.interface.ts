export interface IChatModelDocument {
  sent_to: string;
  sent_from: string;
  message: string;
  isReadedBy: boolean;
  chatType: string;
}
export interface IGetChats {
  chatUserId: string;
}
