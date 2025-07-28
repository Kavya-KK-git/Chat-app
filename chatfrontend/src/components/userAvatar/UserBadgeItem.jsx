

import { Close } from "@mui/icons-material";
import { Chip } from "@mui/material";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Chip
      label={
        <div className="flex items-center space-x-1">
          <span>
            {user.name}
            {admin === user._id && (
              <span className="ml-1 text-xs text-blue-600">(Admin)</span>
            )}
          </span>
        </div>
      }
      onClick={handleFunction}
      onDelete={handleFunction}
      deleteIcon={<Close fontSize="small" />}
      className="m-1 text-sm bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
    />
  );
};

export default UserBadgeItem;
