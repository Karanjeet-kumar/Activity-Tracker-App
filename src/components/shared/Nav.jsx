import { useEffect, useState } from "react";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  ClipboardList,
  SquareCheckBig,
  LayoutDashboard,
  CopyCheck,
  AlarmClockPlus,
  CircleUserRound,
  LogOut,
  User2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNav } from "../context/NavContext";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedUser } from "../redux/authSlice";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { toast } from "sonner";
import axios from "axios";
import { LOGOUT_API } from "../utils/api_const";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

function Nav() {
  const location = useLocation();
  const [activeNav, setActiveNav] = useState(location.pathname);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const { isNavVisible } = useNav();
  const { loggedUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    try {
      const res = await axios.post(LOGOUT_API, { refresh_token: refreshToken });

      if (res.data.success) {
        dispatch(setLoggedUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Session Expired");
      dispatch(setLoggedUser(null));
      navigate("/login");
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  };

  useEffect(() => {
    setActiveNav(location.pathname);
  }, [location.pathname]);

  return (
    <div
      className={`bg-gradient-to-r from-cyan-100 to-cyan-600 p-4 border-r fixed top-16 h-[calc(100vh-4rem)] z-40 overflow-y-auto flex flex-col w-64
    transform transition-transform duration-300 ease-in-out
    ${isNavVisible ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Navigation Section */}
      <nav className="space-y-4 flex-1">
        <div className="space-y-2">
        {!!loggedUser?.isAdmin && (
          <Link to="/dashboard">
            <Button
              variant={activeNav === "/dashboard" ? "default" : "ghost"}
              className="w-full justify-start cursor-pointer mb-2 hover:bg-blue-500 transition-colors"
            >
              <LayoutDashboard className="mr-4" />
              Dashboard
            </Button>
          </Link>
        )}

          <Link to="/activities">
            <Button
              variant={activeNav === "/activities" ? "default" : "ghost"}
              className="w-full justify-start cursor-pointer hover:bg-blue-500 transition-colors"
            >
              {loggedUser?.isAdmin ? (
                <ClipboardList className="mr-4" />
              ) : (
                <AlarmClockPlus className="mr-4" />
              )}
              {loggedUser?.isAdmin ? "Activities" : "New Tasks"}
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-blue-400">
          {!loggedUser?.isAdmin && (
            <Link to="/tasks">
              <Button
                variant={activeNav === "/tasks" ? "default" : "ghost"}
                className="w-full justify-start cursor-pointer mb-2 hover:bg-blue-500 transition-colors"
              >
                <SquareCheckBig className="mr-4" />
                My Tasks
              </Button>
            </Link>
          )}
          {!!loggedUser?.isVerifier && (
            <Link to="/review">
              <Button
                variant={activeNav === "/review" ? "default" : "ghost"}
                className="w-full justify-start cursor-pointer hover:bg-blue-500 transition-colors"
              >
                <CopyCheck className="mr-4" />
                My Reviews
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* User Profile Footer */}
      <div className="mt-auto pt-2 border-t border-blue-400">
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center justify-between p-2 bg-blue-700 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
              <div className="flex items-center gap-3">
                <CircleUserRound
                  className="bg-blue-400 rounded-full p-1 "
                  size={35}
                />
                <div className="text-left">
                  <h1 className="text-sm font-bold text-white truncate max-w-[120px]">
                    {loggedUser?.user_name}
                  </h1>
                  <Badge variant="premium" className="bg-gray-500 mt-1 text-xs">
                    {loggedUser?.isAdmin
                      ? "Admin"
                      : loggedUser?.isHOD
                      ? "HOD"
                      : "EMPLOYEE"}
                  </Badge>
                </div>
              </div>
            </div>
          </PopoverTrigger>

          <PopoverContent
            className="bg-white w-50 rounded-xl shadow-xl border-0 p-0 overflow-hidden"
            align="start"
            side="top"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-2 text-white">
              <div className="flex items-center gap-3">
                <CircleUserRound
                  size={40}
                  className="bg-blue-400 rounded-full p-1"
                />
                <div>
                  <h2 className="font-bold">{loggedUser?.user_name}</h2>
                  <p className="text-sm text-blue-100 truncate max-w-[120px]">
                    {loggedUser?.email_id}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3">
              <div className="mb-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 rounded-lg hover:bg-blue-50 cursor-pointer"
                  onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                >
                  <User2 className="mr-3 text-blue-600" size={18} />
                  <span className="text-blue-800 font-medium">
                    View Profile
                  </span>
                </Button>

                {isProfileExpanded && (
                  <div className="mt-1 bg-blue-50 p-3 rounded-lg animate-in fade-in">
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between">
                        <span className="text-blue-600 font-medium">
                          EmpID:
                        </span>
                        <span className="text-blue-900">
                          {loggedUser?.user_code}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-blue-600 font-medium">
                          Department:
                        </span>
                        <span className="text-blue-900">
                          {loggedUser?.deptName}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-blue-600 font-medium">
                          Status:
                        </span>
                        <span className="text-green-600 font-medium">
                          Active
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator className="my-1" />

              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer"
                onClick={logoutHandler}
              >
                <LogOut className="mr-3" size={18} />
                <span className="font-medium">Logout</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default Nav;
