import { useState } from "react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

function Homepage() {
  const [alignment, setAlignment] = useState("login");

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) setAlignment(newAlignment);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <div className="text-violet-400 font-bold text-2xl mb-6 text-center">
          ChatterBox
        </div>

        <div className="flex justify-center mb-4">
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="auth toggle"
            color="primary"
          >
            <ToggleButton value="login">Login</ToggleButton>
            <ToggleButton value="signup">Sign Up</ToggleButton>
          </ToggleButtonGroup>
        </div>

        {alignment === "login" && <Login />}
        {alignment === "signup" && <Signup />}
      </div>
    </div>
  );
}

export default Homepage;
