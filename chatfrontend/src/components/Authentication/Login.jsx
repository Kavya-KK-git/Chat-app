import React, { useState } from "react";
import { Button, TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import axiosInstance from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const { setUser } = ChatState();
  const navigate = useNavigate();

  const handleClick = () => setShow((prev) => !prev);

  const submitHandler = async () => {
    if (!email || !password) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const { data } = await axiosInstance.post("/api/user/login", {
        email,
        password,
      });

      sessionStorage.setItem("accessToken", data.accessToken);

      const userInfo = {
        ...data,
        token: data.accessToken,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      setUser(userInfo);
      toast.success("Login successful");

      navigate("/chats");
    } catch (error) {
      toast.error("Login failed");
      console.error(error);
    }
  };

  return (
    <div className="p-6 rounded-xl bg-white w-full max-w-md mx-auto mt-5 space-y-5">
      <div className="m-5">
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          required
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="m-5">
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          required
          type={show ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClick}>
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div className="m-5">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={submitHandler}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
