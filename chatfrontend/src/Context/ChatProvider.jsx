import React, { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);

  const loadUser = () => {
    try {
      const storedUser = localStorage.getItem("userInfo");
      const storedToken = sessionStorage.getItem("accessToken");

      if (process.env.NODE_ENV === "development") {
        console.log("ChatProvider: loading userInfo and accessToken");
      }

      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      if (parsedUser && storedToken) {
        setUser({ ...parsedUser, token: storedToken });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to parse userInfo:", err);
      localStorage.removeItem("userInfo");
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    const handleStorageChange = () => loadUser();

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  const context = useContext(ChatContext);
  if (!context) {
    console.warn("ChatState: ChatContext is undefined!");
  }
  return context;
};

export default ChatProvider;
