import { useEffect, useState } from "react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { ClipboardList, SquareCheckBig, LayoutDashboard } from "lucide-react";
import { useNav } from "../context/NavContext";
import { useSelector } from "react-redux";

function Nav() {
  const location = useLocation();
  const [activeNav, setActiveNav] = useState(location.pathname);
  const { isNavVisible } = useNav(); // Get visibility state
  const { loggedUser } = useSelector((store) => store.auth);

  useEffect(() => {
    setActiveNav(location.pathname);
  }, [location.pathname]);

  if (!isNavVisible) return null; // Hide nav when not visible
  return (
    <div className="w-64 bg-gradient-to-b from-blue-500 to-blue-900 p-4 border-r">
      <nav className="space-y-4">
        <div className="space-y-2">
          <Link to="/dashboard">
            <Button
              variant={activeNav === "/dashboard" ? "default" : "ghost"}
              className="w-full justify-start cursor-pointer mb-2"
            >
              <LayoutDashboard />
              Dashboard
            </Button>
          </Link>

          <Link to="/activities">
            <Button
              variant={activeNav === "/activities" ? "default" : "ghost"}
              className="w-full justify-start cursor-pointer"
            >
              <ClipboardList />
              {loggedUser?.isAdmin ? "Activities" : "My Activities"}
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t">
          {!loggedUser?.isAdmin && (
            <Link to="/tasks">
              <Button
                variant={activeNav === "/tasks" ? "default" : "ghost"}
                className="w-full justify-start cursor-pointer"
              >
                <SquareCheckBig />
                My Tasks
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Nav;
