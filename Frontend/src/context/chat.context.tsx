import { createContext, useState } from "react";
interface IMessageInfo {
  message: string;
  file_url?: string;
  message_type?: string;
  sentBy: { name: string; id: string };
  group_id?: string
}
interface IChatContext {
  messageInfo: IMessageInfo;
  setMessageInfo?: (v: any) => any;
}
export let ChatContext = createContext<IChatContext>({
  messageInfo: {
    message: "",
    sentBy: { id: "", name: "" },
  },
});

export const ChatProvider = ({ Child }: any) => {
  let [messageInfo, setMessageInfo] = useState<IMessageInfo>({
    message: "",
    sentBy: { id: "", name: "" },
  });

  return (
    <ChatContext.Provider
      value={{
        messageInfo,
        setMessageInfo,
      }}
    >
      {Child}
    </ChatContext.Provider>
  );
};
