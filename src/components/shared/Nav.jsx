import { useEffect, useState } from "react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { LayoutDashboard } from "lucide-react";
import { useNav } from "../context/NavContext";

function Nav() {
  const location = useLocation();
  const [activeNav, setActiveNav] = useState(location.pathname);
  const { isNavVisible } = useNav(); // Get visibility state

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
        </div>
      </nav>
    </div>
  );
}

export default Nav;
