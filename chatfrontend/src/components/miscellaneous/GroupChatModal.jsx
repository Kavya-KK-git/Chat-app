import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import axiosInstance from "../../axiosInstance";

const GroupChatModal = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { chats, setChats } = ChatState();
  const chatContext = ChatState();
  if (!chatContext) return null;

  const { user } = chatContext;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.warning("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axiosInstance.get(
        `/api/user?search=${query}`,
        config
      );
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to load search results");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      toast.warning("Please fill all the fields");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axiosInstance.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      handleClose();
      toast.success("New Group Chat Created!");
    } catch (error) {
      toast.error(`Failed to create the chat`);
      console.log(error);
    }
  };

  return (
    <>
      <span onClick={handleOpen}>{children}</span>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle className="text-center text-2xl font-sans">
          Create Group Chat
        </DialogTitle>
        <DialogContent className="flex flex-col items-center gap-4">
          <TextField
            fullWidth
            placeholder="Chat Name"
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
            className="mb-4"
          />
          <TextField
            fullWidth
            placeholder="Add Users eg: John, Piyush, Jane"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="mb-2"
          />
          <Box className="w-full flex flex-wrap gap-2">
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </Box>
          <Box className="w-full">
            {loading ? (
              <h2>Loading...</h2>
            ) : (
              searchResult
                .slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Create Chat
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GroupChatModal;
