"use client";
import { useTheme } from "@/context";
import React from "react";
import { GoSun, GoMoon } from "react-icons/go";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full px-4 py-4 border-b border-ui-light-muted dark:border-ui-dark-muted">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <h1>Tracker Mini App</h1>
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? <GoSun /> : <GoMoon />}
        </button>
      </div>
    </header>
  );
};

export default Header;
