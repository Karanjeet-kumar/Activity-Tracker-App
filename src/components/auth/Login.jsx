// import React, { useEffect, useState } from "react";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { useNavigate } from "react-router-dom";
// import { LOGIN_API } from "../utils/api_const";
// import { toast } from "sonner";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { setLoading, setLoggedUser } from "../redux/authSlice";
// import { Loader2 } from "lucide-react";

// const Login = () => {
//   const [input, setInput] = useState({
//     username: "",
//     password: "",
//   });

//   const { loading, loggedUser } = useSelector((store) => store.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const changeEventHandler = (e) => {
//     setInput({ ...input, [e.target.name]: e.target.value });
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     // API(LOGIN_API)--->Connected
//     try {
//       dispatch(setLoading(true));
//       const res = await axios.post(LOGIN_API, input, {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: true,
//       });

//       if (res.data.success) {
//         dispatch(setLoggedUser(res.data.user));
//         localStorage.setItem("access_token", res.data.access_token);
//         localStorage.setItem("refresh_token", res.data.refresh_token);
//         // navigate("/dashboard");
//         toast.success(res.data.message);
//         // Navigation will happen in useEffect when loggedUser updates
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error?.response?.data?.message || "Login failed.");
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   // Handle redirect on successful login
//   useEffect(() => {
//     if (loggedUser) {
//       if (loggedUser?.isAdmin) {
//         navigate("/dashboard");
//       } else {
//         navigate("/activities");
//       }
//     }
//   }, [loggedUser, navigate]);

//   return (
//     <div className="bg-custom w-full h-screen m-0 p-0">
//       <div className="min-h-screen flex items-center justify-center ">
//         <form
//           onSubmit={submitHandler}
//           className="w-1/2 border bg-gray-400 border-gray-300 rounded-xl p-4"
//         >
//           <div className="bg-white">
//             <div className="w-2/3 h-32 bg-header"></div>
//           </div>
//           <h1 className="mt-2 font-bold text-xl mb-5 text-center text-blue-700">
//             Login
//           </h1>
//           <div className="my-2 space-y-1">
//             <Label>Username</Label>
//             <Input
//               type="text"
//               value={input.username}
//               name="username"
//               onChange={changeEventHandler}
//               placeholder="Your Name"
//               className="border-gray-300 bg-white"
//             />
//           </div>
//           <div className="my-2 space-y-1">
//             <Label>Password</Label>
//             <Input
//               type="password"
//               value={input.password}
//               name="password"
//               onChange={changeEventHandler}
//               placeholder="* * * * * * * * "
//               className="border-gray-300 bg-white"
//             />
//           </div>
//           {loading ? (
//             <Button className="w-full my-4 bg-blue-600 hover:bg-blue-500">
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
//             </Button>
//           ) : (
//             <Button
//               type="submit"
//               className="w-full my-4 bg-blue-600 hover:bg-blue-500 cursor-pointer"
//             >
//               Login
//             </Button>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

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
import { Loader2, LockKeyhole, Eye, EyeOff, User2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const { loading, loggedUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsAnimating(true);

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
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed.");
    } finally {
      dispatch(setLoading(false));
      setTimeout(() => setIsAnimating(false), 300);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-500 to-blue-200 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl min-h-[450px] bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left side - Image with Logo */}
        <div className="w-full md:w-1/2 relative overflow-hidden">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="Team collaboration"
            className="w-full h-full object-cover"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-indigo-800/80 z-10"></div>

          {/* Content container */}
          <div className="absolute inset-0 z-20 flex flex-col p-6 overflow-auto">
            {/* Essar Logo at the top */}
            <div className="flex justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-md p-2 mb-6 flex justify-center items-center w-[300px]">
                <img
                  src="/banner-essar.jpg"
                  alt="Essar Logo"
                  className="w-full h-40 object-contain rounded-md border-2 border-white"
                />
              </div>
            </div>

            {/* Lock and text below the logo */}
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mb-4">
                <LockKeyhole className="w-10 h-10 text-white" />
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                Welcome Back
              </h1>
              <p className="text-blue-100 text-sm max-w-xs text-center">
                Access your account to manage activities, track progress, and
                collaborate with your team.
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 p-6 flex items-center justify-center overflow-y-auto">
          <form
            onSubmit={submitHandler}
            className={`w-full max-w-xs transition-transform duration-300 ${
              isAnimating ? "scale-[0.98]" : "scale-100"
            }`}
          >
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Login to Account
              </h1>
              <p className="text-gray-500 text-sm">
                Enter your credentials to continue
              </p>
            </div>

            <div className="space-y-4">
              {/* Username Field */}
              <div className="space-y-1">
                <Label className="text-gray-700 text-sm flex items-center">
                  <User2 className="w-4 h-4 mr-1" /> Username
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={input.username}
                    name="username"
                    onChange={changeEventHandler}
                    placeholder="Your username"
                    className="pl-9 text-sm border-gray-300 bg-white rounded-lg h-10"
                    required
                  />
                  <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <Label className="text-gray-700 text-sm flex items-center">
                  <LockKeyhole className="w-4 h-4 mr-1" /> Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={input.password}
                    name="password"
                    onChange={changeEventHandler}
                    placeholder="Enter your password"
                    className="pl-9 text-sm border-gray-300 bg-white rounded-lg h-10"
                    required
                  />
                  <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 cursor-pointer" />
                    ) : (
                      <Eye className="w-4 h-4 cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              {loading ? (
                <Button
                  disabled
                  className="w-full mt-4 h-10 bg-indigo-600 text-white font-medium rounded-lg text-sm"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                  in...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full mt-4 h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors shadow-md hover:shadow-lg cursor-pointer"
                >
                  Sign in
                </Button>
              )}

              <div className="mt-4 text-center">
                <p className="text-gray-600 text-xs">
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Contact Admin
                  </a>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
