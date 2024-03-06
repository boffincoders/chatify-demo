export interface ICreateGroup {
  isModalOpen: boolean;
  setIsModalOpen: (value: any) => void;
  children: any;
  title: string;
}
export interface ICreateGroupPayload {
  about: string;
  name: string;
}
export interface IAddGroupParticipants {
  participants: string[];
  group_id: string;
}
