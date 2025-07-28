import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { toast } from "react-toastify";
import ChatLoading from "../ChatLoading";
import ProfileModal from "./ProfileModal";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const history = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast.warn("Please enter something in search");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axiosInstance.get(
        `/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to load search results");
      console.log(error);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axiosInstance.post(
        `/api/chat`,
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setDrawerOpen(false);
    } catch (error) {
      toast.error("Error fetching the chat");
      console.log(error);
    }
  };

  return (
    <>
      <Box
        className="flex justify-between items-center p-2 border-b border-gray-200 bg-white"
        width="100%"
      >
        <Tooltip title="Search Users to chat" placement="bottom-end">
          <Button onClick={() => setDrawerOpen(true)} variant="outlined">
            <i className="fas fa-search mr-2"></i>
            <Typography variant="body1" className="hidden md:block">
              Search User
            </Typography>
          </Button>
        </Tooltip>

        <Typography variant="h5" className="font-sans">
          ChatterBox
        </Typography>

        <Box className="flex items-center gap-2">
          <Menu>
            <List>
              {notification.length === 0 ? (
                <ListItem>No New Messages</ListItem>
              ) : (
                notification.map((notif) => (
                  <ListItem
                    button
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </ListItem>
                ))
              )}
            </List>
          </Menu>

          <Menu>
            <MenuItem>
              <Avatar
                alt={user.name}
                src={user.pic}
                sx={{ width: 30, height: 30, marginRight: 1 }}
              />
            </MenuItem>
            <List>
              <ProfileModal user={user}>
                <ListItem button>My Profile</ListItem>
              </ProfileModal>
              <Divider />
              <ListItem button onClick={logoutHandler}>
                Logout
              </ListItem>
            </List>
          </Menu>
        </Box>
      </Box>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box className="w-80 p-4">
          <Typography variant="h6" className="border-b pb-2 mb-4">
            Search Users
          </Typography>
          <Box className="flex pb-2">
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={handleSearch} className="ml-2">
              Go
            </Button>
          </Box>

          {loading ? (
            <ChatLoading />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            ))
          )}

          {loadingChat && (
            <div className="flex justify-end p-2">Loading...</div>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default SideDrawer;
