import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const navigate = useNavigate();

  const chatContext = ChatState();
  const user = chatContext?.user;

  useEffect(() => {
    if (!user) {
      console.warn("User not loaded, navigating back.");
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="w-full">
      <SideDrawer />
      <div className="flex justify-between w-full h-[91.5vh] p-2">
        <MyChats fetchAgain={fetchAgain} />
        <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </div>
    </div>
  );
};

export default Chatpage;
