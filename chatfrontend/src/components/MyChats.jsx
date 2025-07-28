import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Add as AddIcon, Logout as LogoutIcon } from "@mui/icons-material";
import { ChatState } from "../Context/ChatProvider";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import axiosInstance from "../axiosInstance";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(false);
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/api/chat");
      setChats(data);
    } catch (error) {
      toast.error("Failed to load the chats");
      console.error("Error fetching chats:", error);
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.reload();
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(userInfo);
    if (userInfo) fetchChats();
  }, [fetchAgain]);

  return (
    <div
      className={`${
        selectedChat ? "hidden md:flex" : "flex"
      } flex-col items-center p-3 bg-white w-full md:w-[31%] rounded-lg border border-gray-300`}
    >
      <div className="flex w-full items-center justify-between pb-3 px-3">
        <div className="text-2xl font-semibold">My Chats</div>
        <GroupChatModal>
          <button className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">
            <AddIcon className="!text-sm" />
            <span>New Group Chat</span>
          </button>
        </GroupChatModal>
      </div>

      {loggedUser && (
        <div className="flex items-center justify-between w-full px-3 mb-2">
          <div className="flex items-center gap-2">
            <img
              src={loggedUser.pic}
              alt="Profile"
              className="w-10 h-10 rounded-full border border-gray-400"
            />
            <span className="font-medium">{loggedUser.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-500 hover:text-red-700"
          >
            <LogoutIcon fontSize="small" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      )}

      <div className="flex flex-col p-3 bg-gray-100 w-full h-full rounded-lg overflow-y-auto">
        {loading ? (
          <ChatLoading />
        ) : Array.isArray(chats) && chats.length > 0 ? (
          <div className="flex flex-col gap-2">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`cursor-pointer px-3 py-2 rounded-lg ${
                  selectedChat === chat
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                <div className="font-medium">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </div>
                {chat.latestMessage && (
                  <div className="text-sm truncate">
                    <strong>{chat.latestMessage.sender.name}: </strong>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            No chats available
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChats;
