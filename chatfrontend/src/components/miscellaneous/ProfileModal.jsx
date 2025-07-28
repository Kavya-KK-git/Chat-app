

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Avatar,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <IconButton onClick={handleOpen} className="flex">
          <VisibilityIcon />
        </IconButton>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle className="text-center text-2xl font-semibold font-sans">
          {user.name}
        </DialogTitle>

        <DialogContent className="flex flex-col items-center gap-4 py-6">
          <Avatar
            src={user.pic}
            alt={user.name}
            sx={{ width: 120, height: 120 }}
          />
          <div className="text-xl font-medium font-sans">
            Email: {user.email}
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileModal;
