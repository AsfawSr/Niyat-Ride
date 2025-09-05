import { RouterProvider } from "react-router-dom";
import { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import router from "./routes"; // ✅ clean import from routes/index.jsx
import GlobalError from "./api/GlobalErrorHandler";

function App() {
  const [darkMode, setDarkmode] = useState(false);
  const toggleHandler = () => setDarkmode((prev) => !prev);
  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 py-3">
        <GlobalError />
        <RouterProvider router={router} />
        <button
          onClick={toggleHandler}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white shadow-md hover:scale-110 transition-transform"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </div>
  );
}

export default App;
