import React, { useState } from "react";
import { Button, TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // const [pic, setPic] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [show, setShow] = useState(false);
  // const [picLoading, setPicLoading] = useState(false);

  const handleClick = () => setShow((prev) => !prev);

  // const postDetails = (file) => {
  //   if (!file) return toast.error("No image selected");
  //   // setPic(file);
  //   toast.success("Image selected");
  // };
  const navigate = useNavigate();

  const submitHandler = async () => {
    // setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast.error("Please fill all the fields");
      // setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast.error("Passwords do not match");
      // setPicLoading(false);
      return;
    }

    try {
      const { data } = await axiosInstance.post(
        "/api/user",
        { name, email, password },
        {
          headers: {
            "Content-type": "application/json",
          },
          withCredentials: true,
        }
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Signup successful");
      navigate("/chats");
    } catch (error) {
      toast.error("Failed to register user");
      console.log(error);
    }
    // finally {
    //   setPicLoading(false);
    // }
  };

  return (
    <div className="p-6 rounded-xl bg-white  w-full max-w-md mx-auto space-y-5">
      <div className="m-5">
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          required
          onChange={(e) => setName(e.target.value)}
        />
      </div>
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
        <TextField
          label="Confirm Password"
          variant="outlined"
          fullWidth
          required
          type={show ? "text" : "password"}
          onChange={(e) => setConfirmpassword(e.target.value)}
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
        {/* <div className="border my-5">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
            className="mt-2"
          />
        </div> */}
      </div>
      <div className="m-5">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={submitHandler}
          // disabled={picLoading}
        >
          {/* {picLoading ? "Loading..." : */}
          Sign Up
          {/* } */}
        </Button>
      </div>
    </div>
  );
};

export default Signup;
