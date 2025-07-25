import { createContext, useContext } from "react";

export type ThemeT = "light" | "dark";

export type ThemeContextT = {
  theme: ThemeT;
  setTheme: (theme: ThemeT) => void;
};

export const ThemeContext = createContext<ThemeContextT>({
  theme: "light",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);
