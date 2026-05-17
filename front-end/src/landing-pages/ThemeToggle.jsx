import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      className="glass-panel inline-flex items-center gap-3 rounded-full px-3 py-2 transition-all duration-300 hover:-translate-y-0.5"
    >
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-full"
        style={{
          background: isLight ? "rgba(15, 23, 42, 0.08)" : "rgba(96, 165, 250, 0.14)",
          color: isLight ? "var(--text)" : "#fbbf24",
        }}
      >
        {isLight ? <FaMoon size={16} /> : <FaSun size={16} />}
      </span>
      <span className="hidden text-sm font-medium md:block text-muted">
        {isLight ? "Dark mode" : "Light mode"}
      </span>
    </button>
  );
};

export default ThemeToggle;
