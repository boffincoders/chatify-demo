import { UserOutlined } from "@ant-design/icons";
import { Avatar, Badge } from "antd";
import { HttpStatusCode } from "axios";
import { useContext, useEffect, useState } from "react";
import Loader from "../../../../components/loader";
import { ChatContext } from "../../../../context/chat.context";
import { SocketContext } from "../../../../context/socket.context";
import { IUsersData } from "../../../../interfaces/response/users.Respo.interafce";
import ChatServices from "../../../../services/index";
import ChattingArea from "../chattingArea";
import ChatingArea from "../components/chatingArea";
import ChatWithUser from "./chatWithUser";
const PersonalChat = () => {
  const [usersList, setUsersList] = useState<IUsersData[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUsersData | null>(null);
  const { messageInfo } = useContext(ChatContext);
  const { socket } = useContext(SocketContext);
  const [loading, setLoading] = useState<boolean>(false);
  const getAllUsers = async () => {
    setLoading(true);
    let response = await ChatServices.getUsers();
    if (response.statusCode === HttpStatusCode.Ok)
      setUsersList(
        response.data.map((x) => {
          return { ...x, isSelected: false };
        })
      );
    setLoading(false);
  };
  const handleSelectUser = (userData: IUsersData) => {
    setSelectedUser(userData);
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (messageInfo.message) {
      let findUserExists = usersList.find(
        (x) => x._id.toString() === messageInfo.sentBy.id.toString()
      );
      setUsersList((prev) => {
        if (!findUserExists)
          prev = [
            ...prev,
            {
              __v: 0,
              _id: messageInfo.sentBy.id,
              createdAt: new Date().toString(),
              email: "a@gfmail.com",
              last_login: new Date().toString(),
              name: messageInfo.sentBy.name,
              password: "",
              unReadedMessages: 1,
              isSelected: false,
              profile: "",
              unreadMessages: 1,
            },
          ];
        else
          prev = prev.map((prevUsers) => {
            if (prevUsers._id.toString() === messageInfo.sentBy.id)
              prevUsers = {
                ...prevUsers,
                unReadedMessages: Number(prevUsers.unReadedMessages) + 1,
              };

            return prevUsers;
          });
        return [...prev];
      });
    }
  }, [messageInfo]);
  useEffect(() => {
    if (selectedUser) {
      socket.mySocket.emit("startChat", {
        id: socket.user?._id,
        userId: selectedUser._id,
      });
      setUsersList((prev) =>
        prev.map((prevUsers) => {
          if (prevUsers._id === selectedUser._id)
            prevUsers = { ...prevUsers, unReadedMessages: 0 };
          return prevUsers;
        })
      );
    }
  }, [selectedUser]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : selectedUser ? (
        selectedUser && (
          <ChatWithUser
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
          />
        )
      ) : (
        <ChatingArea
          sideBarChatChild={
            usersList && (
              <div className="py-3">
                {usersList?.map((x) => (
                  <div className="px-2 mt-1 " key={x._id}>
                    <div
                      className={`${
                        x.isSelected
                          ? "bg-[#00A038] rounded-2xl  text-white w-full"
                          : ""
                      } dark:text-white px-4`}
                    >
                      <Badge size="small" count={x.unReadedMessages}>
                        <div
                          onClick={() => handleSelectUser(x)}
                          className={`flex cursor-pointer items-center gap-4  p-2 `}
                        >
                          <Avatar
                            size={"large"}
                            src={
                              x?.profile ?? (
                                <UserOutlined
                                  className={`${
                                    x.isSelected ? "text-white" : "text-[black]"
                                  } dark:text-white`}
                                />
                              )
                            }
                          />
                          <div
                            className={`text-lg  ${
                              x.isSelected ? "text-white" : "text-black"
                            } dark:text-white`}
                          >
                            {x.name?.length > 12
                              ? x.name.slice(0, 12) + "..."
                              : x.name}
                          </div>
                        </div>
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
          chatAreaChild={<ChattingArea />}
        />
      )}
    </div>
  );
};

export default PersonalChat;
