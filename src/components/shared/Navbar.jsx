import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";
import { CircleUserRound, LogOut, User2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/react.svg";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setLoggedUser } from "../redux/authSlice";
import axios from "axios";
import { LOGOUT_API } from "../utils/api_const";
import { useNav } from "../context/NavContext";

const Navbar = () => {
  const { toggleNav } = useNav(); // Get toggle function from context
  const { loggedUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isProfileExpanded, setIsProfileExpanded] = useState(false);

  const logoutHandler = async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    // API(LOGOUT_API)--->Connected
    try {
      const res = await axios.post(LOGOUT_API, { refresh_token: refreshToken });

      if (res.data.success) {
        dispatch(setLoggedUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-900 text-white">
      <div className="flex items-center justify-between mx-4 max-w-7xl h-16">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={toggleNav}
        >
          <img
            src={logo}
            alt="logo"
            style={{
              borderRadius: "20%",
              border: "1px solid #36efef",
              width: "50px",
              height: "50px",
            }}
          />
          <h1 className="text-2xl font-bold">
            Activity<span className="text-[#36efef]">Tracker</span>
          </h1>
        </div>
        <div className="lg:mr-3">
          <div className="flex items-center gap-3">
            <h1 className="text-md font-bold">{loggedUser?.email_id}</h1>
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <CircleUserRound size={32} />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="bg-white">
                <div>
                  <div className="flex flex-col my-2 text-black">
                    {/* View Profile Section */}
                    <div className="flex flex-col">
                      <div className="flex w-fit items-center ">
                        <User2 />
                        <Button
                          variant="link"
                          onClick={() =>
                            setIsProfileExpanded(!isProfileExpanded)
                          }
                          className={"cursor-pointer"}
                        >
                          View Profile
                        </Button>
                      </div>
                      {/* Expanded Profile Data */}
                      {isProfileExpanded && (
                        <div className="ml-10 bg-gradient-to-b from-gray-500 to-gray-200 border border-black">
                          <div className=" ml-2 mt-1 space-y-1">
                            <p className="text-sm">
                              EmpID: {loggedUser?.user_code}
                            </p>
                            <p className="text-sm">
                              Email: {loggedUser?.email_id}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Logout Section */}
                    <div className="flex w-fit items-center ">
                      <LogOut />
                      <Button
                        onClick={logoutHandler}
                        variant="link"
                        className="cursor-pointer"
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
