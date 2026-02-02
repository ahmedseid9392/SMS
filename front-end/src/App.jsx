import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { useTheme } from "./context/ThemeContext";


const App = () => {
     const { theme } = useTheme();
    return(
        <div data-theme={theme} className="min-h-screen transition-all duration-500">
        <ThemeProvider>
<Toaster position="top-right" reverseOrder={false} />
<AppRoutes />
</ThemeProvider>
</div>
)
}
export default App;

