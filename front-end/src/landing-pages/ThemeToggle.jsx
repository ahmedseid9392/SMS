import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-all duration-300 hover:scale-110"
    >
      {theme === "light" ? <FaMoon size={22} /> : <FaSun size={22} />}
    </button>
  );
};

export default ThemeToggle;
