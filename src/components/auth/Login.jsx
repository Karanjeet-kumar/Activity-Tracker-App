import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const Login = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  return (
    <div className="bg-custom w-full h-screen m-0 p-0">
      <div className="min-h-screen flex items-center justify-center ">
        <form
          // onSubmit={submitHandler}
          className="w-1/2 border bg-gray-400 border-gray-300 rounded-xl p-4"
        >
          <h1 className="font-bold text-xl mb-5 text-center text-blue-700">
            Login
          </h1>
          <div className="my-2 space-y-1">
            <Label>Username</Label>
            <Input
              type="text"
              value={input.username}
              name="username"
              onChange={changeEventHandler}
              placeholder="Your Name"
              className="border-gray-300 bg-white"
            />
          </div>
          <div className="my-2 space-y-1">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="* * * * * * * * "
              className="border-gray-300 bg-white"
            />
          </div>
          <Button
            type="submit"
            className="w-full my-4 bg-blue-600 hover:bg-blue-500 cursor-pointer"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
