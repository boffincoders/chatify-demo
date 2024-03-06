import { MdChatBubbleOutline } from "react-icons/md";

const ChattingArea = () => {
  return (
    <div className="text-black flex justify-center items-center mt-44">
      <div className="text-center">
        {" "}
        <div className="flex justify-center">
          <MdChatBubbleOutline className="text-7xl text-green-500" />
        </div>
        <h1 className="text-3xl text-center dark:text-white">
          Free Chat With Users
        </h1>
      </div>
    </div>
  );
};

export default ChattingArea;
