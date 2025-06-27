import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { LOGIN_API } from "../utils/api_const";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setLoggedUser } from "../redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const { loading, loggedUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // API(LOGIN_API)--->Connected
    try {
      dispatch(setLoading(true));
      const res = await axios.post(LOGIN_API, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setLoggedUser(res.data.user));
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);
        // navigate("/dashboard");
        toast.success(res.data.message);
        // Navigation will happen in useEffect when loggedUser updates
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Handle redirect on successful login
  useEffect(() => {
    if (loggedUser) {
      if (loggedUser?.isAdmin) {
        navigate("/dashboard");
      } else {
        navigate("/activities");
      }
    }
  }, [loggedUser, navigate]);

  return (
    <div className="bg-custom w-full h-screen m-0 p-0">
      <div className="min-h-screen flex items-center justify-center ">
        <form
          onSubmit={submitHandler}
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
          {loading ? (
            <Button className="w-full my-4 bg-blue-600 hover:bg-blue-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full my-4 bg-blue-600 hover:bg-blue-500 cursor-pointer"
            >
              Login
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
