import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/theme.hook";

export default function ToggleTheme() {
  const { toggleTheme, theme } = useTheme();
  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme}>
      {theme === "light" && <Moon size={16} />}
      {theme === "dark" && <Sun size={16} />}
    </Button>
  );
}
