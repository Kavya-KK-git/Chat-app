import { Avatar, Box } from "@mui/material";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      className="flex items-center w-full px-3 py-2 mb-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-teal-500 hover:text-white text-black"
    >
      <Avatar
        alt={user.name}
        src={user.pic}
        sx={{ width: 32, height: 32, marginRight: 1 }}
      />
      <Box>
        <div className="text-sm">{user.name}</div>{" "}
        <div className="text-xs">
          {" "}
          <strong>Email:</strong> {user.email}
        </div>
      </Box>
    </Box>
  );
};

export default UserListItem;
