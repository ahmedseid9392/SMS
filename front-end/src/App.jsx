import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { useTheme } from "./context/ThemeContext";
import "./App.css";

const App = () => {
  const { theme } = useTheme();

  return (
    <div data-theme={theme} className="app-shell min-h-screen transition-all duration-500">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--card)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-md)",
            backdropFilter: "blur(16px)",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <AppRoutes />
    </div>
  );
};

export default App;
