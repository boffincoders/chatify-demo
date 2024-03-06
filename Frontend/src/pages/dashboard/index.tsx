import { notification } from "antd";
import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Admin from "../../components/layout";
import Loader from "../../components/loader";
import { ChatContext } from "../../context/chat.context";
import { SocketContext } from "../../context/socket.context";

const DashBoard = () => {
  const { setMessageInfo } = useContext<any>(ChatContext);
  const { socket, setSocket } = useContext<any>(SocketContext);
  let loggedInUser = localStorage.getItem("loggedInUser")
    ? JSON.parse(localStorage.getItem("loggedInUser")!)
    : null;
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === "/") navigate("/dashboard");
  }, []);
  useEffect(() => {
    if (loggedInUser && !socket.user)
      setSocket({ mySocket: null, user: loggedInUser });
  }, [loggedInUser]);
  useEffect(() => {
    if (socket.mySocket) {
      socket.mySocket.on("chatMessage", (args: any) => {
        if (args) {
          setMessageInfo({
            message: args.message,
            sentBy: { id: args.sent_from._id, name: args.sent_from.name },
          });
          if (args.sent_from._id !== loggedInUser._id)
            notification.info({
              message: args.sent_from.name,
              type: "info",
              description: args?.message_type ? 'Sent you a file':'Sent you a message'
            });
        }
      });
      socket.mySocket.on("groupMessage", (args: any) => {
        console.log("received group message args", args)
        if (args) {
          setMessageInfo({
            ...args,
            group_id: args.sent_to,
            sentBy: { id: args.sent_from._id, name: args.sent_from.name },
          });
          if (args.sent_from._id !== loggedInUser._id)
            notification.info({
              message: `${args.group_name}`,
              type: "info",
              description: args?.message_type ? 'Sent you a file':'Sent you a message'
            });
        }
      });
    }
  }, [socket.mySocket]);
  return <div>{!loggedInUser?.last_login ? <Loader /> : <Admin />}</div>;
};

export default DashBoard;
