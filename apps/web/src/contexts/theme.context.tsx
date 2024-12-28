import { Theme } from "@/types/theme.type";
import { createContext } from "react";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  {} as ThemeContextType
);
