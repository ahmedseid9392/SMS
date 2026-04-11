import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { useTheme } from "./context/ThemeContext";


const App = () => {
     const { theme } = useTheme();
    return(
        <div data-theme={theme} className="min-h-screen transition-all duration-500">
        <ThemeProvider>
<Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--card)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
<AppRoutes />
</ThemeProvider>
</div>
)
}
export default App;

