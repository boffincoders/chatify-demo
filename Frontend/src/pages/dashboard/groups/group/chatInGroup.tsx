import { GroupOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Image,
  Input,
  Spin,
  Upload,
  notification,
} from "antd";
import { HttpStatusCode } from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FiPaperclip, FiSend, FiSmile } from "react-icons/fi";
import Loader from "../../../../components/loader";
import { ChatContext } from "../../../../context/chat.context";
import { SocketContext } from "../../../../context/socket.context";
import { IChatData } from "../../../../interfaces/response/chats.interface";
import ChatServices from "../../../../services/index";
import EmojiPicker from "emoji-picker-react";
import { formatDate, formatTime } from "../../../../utils/helpers";
import appService from "../../../../services";
import { MdClose } from "react-icons/md";
import { IMyGroupsData } from "../../../../interfaces/response/groupRespo.interface";
import AddGroupParticipantsModal from "../components/addParticipants.modal";
import services from "../../../../services/index";

const ChatInGroup = ({
  selectedGroup,
  setSelectedGroup,
}: {
  selectedGroup: IMyGroupsData;
  setSelectedGroup: (value: any) => any;
}) => {
  let loggedInUser = localStorage.getItem("loggedInUser")
    ? JSON.parse(localStorage.getItem("loggedInUser")!)
    : null;
  const uploadRef = useRef();

  const [myChats, setMyChats] = useState<IChatData[]>([]);
  const { socket } = useContext(SocketContext);
  const { messageInfo } = useContext(ChatContext);
  const [message, setMessage] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [file, setFile] = useState<File>();
  const [isMojiOpen, setIsMojiOpen] = useState<boolean>(false);
  const [uploadingImages, setUploadingImage] = useState<boolean>(false);
  const [openAddParticipantModal, setOpenAddParticipantModal] =
    useState<boolean>(false);

  const [addingParticipants, setAddingParticipants] = useState<boolean>(false);

  const getChatInGroup = async (groupId: string) => {
    setLoader(true);
    let response = await ChatServices.getGroupChats(groupId);
    if (response.statusCode === HttpStatusCode.Ok) setMyChats(response.data);
    setLoader(false);
  };
  const customRequest = async ({ file, onSuccess, onError }: any) => {
    setUploadingImage(true);
    try {
      setFile(file);
      onSuccess();
    } catch (error) {
      onError(error);
    }
    setUploadingImage(false);
  };
  const uploadFile = async () => {
    if (file) {
      let formData = new FormData();
      formData.append("file", file);
      let uploadedImage = await appService.uploadImage(formData);
      if (uploadedImage) return uploadedImage.data.uploadedFileUrl;
    }
  };
  const messageHandler = async (userId: string, message: string) => {
    setMessage("");
    let fileUrl = await uploadFile();
    setMyChats((prev) => {
      return [
        ...prev,
        {
          ...(fileUrl && {
            message_type: "file",
            file_url: fileUrl,
          }),
          message: message,
          sent_from: loggedInUser._id,
          __v: 0,
          date: new Date().toString(),
          _id: Math.random().toString(),
          isReaded: false,
          sent_to: userId,
          group_id: selectedGroup._id,
          chatType: "Group",
        },
      ];
    });
    if (fileUrl) {
      setFile(undefined);
    }
    socket.mySocket.emit("personalMessage", {
      message,
      ...(fileUrl && {
        message_type: "file",
        file_url: fileUrl,
      }),
      sent_to: userId,
      group_id: selectedGroup._id,
      chatType: "Group",
    });
  };

  useEffect(() => {
    if (selectedGroup) getChatInGroup(selectedGroup._id);
  }, [selectedGroup]);

  useEffect(() => {
    if (
      messageInfo &&
      messageInfo.group_id &&
      messageInfo.group_id?.toString() === selectedGroup._id
    )
      setMyChats((prev) => {
        return [
          ...prev,
          {
            ...(messageInfo?.file_url && {
              message_type: "file",
              file_url: messageInfo.file_url,
            }),
            message: messageInfo?.message,
            sent_from: messageInfo.sentBy.id,
            __v: 0,
            date: new Date().toString(),
            _id: Math.random().toString(),
            isReaded: true,
            sent_to: loggedInUser._id,
            group_id: messageInfo.group_id,
            chatType: "Group",
          },
        ];
      });
  }, [messageInfo]);
  return (
    <>
      <div>
        <div className="bg-[#00A038] rounded-xl py-4">
          <div className="flex justify-between px-6">
            <div className="text-white flex gap-4 items-center">
              <Avatar size={"large"} src={<GroupOutlined />} />
              <p className="font-semibold">{selectedGroup?.name}</p>
            </div>
            <div>
              <Button
                onClick={() => setSelectedGroup(null)}
                type="primary"
                className="text-white mt-2 text-base font-medium"
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
        <div>
          <Spin spinning={uploadingImages}>
            {loader ? (
              <Loader />
            ) : (
              <div className="shadow-2xl dark:shadow bg-white  mt-6   dark: dark:bg-navy-900 overflow-y-auto overflow-x-hidden ">
                {selectedGroup.userDetails?.some((details) => {
                  if (details.id._id === loggedInUser._id && details.is_admin)
                    return true;
                }) && (
                  <div className="flex justify-between m-4">
                    <div></div>
                    <Button
                      onClick={() => {
                        setOpenAddParticipantModal(true);
                      }}
                      type="primary"
                      className="text-white mt-2 text-base font-medium"
                    >
                      + Add Participant
                    </Button>
                  </div>
                )}
                <div className="flex justify-center mt-2 py-4">
                  <p className="text-center text-white bg-[#00A038] px-10 rounded-2xl  ">
                    {myChats?.[0]?.date && formatDate(myChats?.[0]?.date)}
                  </p>
                </div>
                <div
                  className="overflow-y-auto max-h-[500px]"
                  style={{ minHeight: "49vh" }}
                >
                  {myChats && myChats.length > 0 ? (
                    myChats.map((x:any) => {
                      let _width = 200;
                      let _height = 200;
                      if (
                        x?.sent_from?._id?.toString() !== loggedInUser._id.toString()
                      )
                        return x.file_url ? (
                          <div key={x._id} className="flex mb-3 px-3">
                            <div className="bg-[#00A038] p-4 rounded-xl text-white flex flex-col gap-3">
                              <Image
                                src={x.file_url}
                                width={_width}
                                height={_height}
                              />
                              <div> {x.message}</div>
                              <div className="text-end">
                                <p className="text-gray-800 text-xs">
                                  {formatTime(x.date)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div key={x._id} className="flex mb-3 px-6">
                            <div className="bg-[#00A038] px-6 py-1 rounded-xl text-white flex flex-col gap-4">
                              <div>
                                {" "}
                                {x.message}{" "}
                                <div className="text-end">
                                  <p className="text-gray-800 text-xs">
                                    {formatTime(x.date)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      else
                        return x.file_url ? (
                          <div
                            key={x._id}
                            className="flex justify-between mb-3 px-3 "
                          >
                            <div></div>
                            <div className="bg-brandLinear text-white p-4 rounded-xl flex flex-col gap-3">
                              <Image
                                src={x.file_url}
                                width={_width}
                                height={_height}
                              />
                              <div>
                                {x.message}
                                <div className="text-end">
                                  <p className="text-gray-800 text-xs">
                                    {formatTime(x.date)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={x._id}
                            className="flex justify-between px-3 py-1 mb-3 "
                          >
                            <div></div>
                            <div className="text-black shadow-xl bg-brandLinear text-white px-6 rounded-xl">
                              {x.message && (
                                <>
                                  {x.message}
                                  <div className="text-end">
                                    <p className="text-gray-800 text-xs">
                                      {formatTime(x.date)}
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                    })
                  ) : (
                    <div className="text-center mt-10 text-xl  dark:text-white font-medium pb-4">
                      <p>No Chats Found</p>
                    </div>
                  )}
                </div>
                <EmojiPicker
                  open={isMojiOpen}
                  className="m-10"
                  onEmojiClick={(e) => {
                    setMessage((prev) => (prev += e.emoji));
                  }}
                />
                {file && (
                  <Card
                    title={
                      <div className="flex justify-between align-middle">
                        <div>Seletecd Media</div>{" "}
                        <MdClose
                          className="border  cursor-pointer"
                          size={"25px"}
                          onClick={() => {
                            setFile(undefined);
                          }}
                        />
                      </div>
                    }
                    className="mt-5 mx-5 shadow-2xl"
                  >
                    <div>
                      <Image
                        src={URL.createObjectURL(file as any)}
                        width={100}
                        height={100}
                      />
                    </div>
                  </Card>
                )}
              </div>
            )}

            <Input
              prefix={
                <>
                  <Upload
                    id="file"
                    ref={uploadRef}
                    accept="image/*"
                    showUploadList={false}
                    customRequest={customRequest}
                    style={{ display: "none" }}
                    multiple={false}
                  >
                    <FiPaperclip className="cursor-pointer" />
                  </Upload>
                  <FiSmile
                    onClick={() => {
                      setIsMojiOpen(!isMojiOpen);
                    }}
                    className="cursor-pointer"
                  />
                </>
              }
              value={message}
              onKeyDown={(e) => {
                if (e.code.toLowerCase() === "escape") setIsMojiOpen(false);
                if (e.code.toLowerCase() === "enter" && !e.shiftKey)
                  (message || file) &&
                    messageHandler(selectedGroup._id, message);
                // if (e.shiftKey && e.code.toLowerCase() === "enter")
                //   message && setMessage((prev) => (prev += '\t\t\t\t\t\t\t\t'));
              }}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type here . . . . ."
              suffix={
                <FiSend
                  onClick={() =>
                    (message || file) &&
                    messageHandler(selectedGroup._id, message)
                  }
                  className="cursor-pointer"
                />
              }
              size="large"
              className="rounded-none w-full"
            />
          </Spin>
        </div>
        {openAddParticipantModal && (
          <AddGroupParticipantsModal
            open={openAddParticipantModal}
            setOpen={(value: any) => {
              setOpenAddParticipantModal(value);
            }}
            groupDetails={selectedGroup}
            handleSubmit={async (values: any) => {
              setAddingParticipants(true);
              {
                let addedResponse = await services.addParticipant({
                  group_id: selectedGroup._id,
                  participants: values.participants,
                });
                if (addedResponse.success) {
                  notification.success({
                    message: "Participants added in the group",
                  });
                }
              }
              setAddingParticipants(false);
              setOpenAddParticipantModal(false);
            }}
            addingParticipants={addingParticipants}
          />
        )}
      </div>
    </>
  );
};

export default ChatInGroup;
