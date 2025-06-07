// src/context/NavContext.js
import React, { createContext, useState, useContext } from "react";

const NavContext = createContext();

export function NavProvider({ children }) {
  const [isNavVisible, setIsNavVisible] = useState(true);

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  return (
    <NavContext.Provider value={{ isNavVisible, toggleNav }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  return useContext(NavContext);
}
