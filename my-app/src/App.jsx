import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa"; // import icons
import Login from "./Pages/Login";
import RootLayout from "./Pages/RootLayout";
import AdminSignup from "./Pages/AdminSignup";
import Dashboard from "./Pages/Dashboard";
import AllUsers from "./Pages/userManagement/AllUsers";
import ActiveUsers from "./Pages/userManagement/ActiveUsers";
import BannedUsers from "./Pages/userManagement/BannedUsers";
import InactiveUsers from "./Pages/userManagement/InactiveUsers";
// import PageNotFound from "./Pages/Layout/PageNotFound";

function App() {
  const [darkMode, setDarkmode] = useState(false);

  const toggleHandler = () => setDarkmode((prev) => !prev);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Login /> },
        { path: "signup", element: <AdminSignup /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "AllUsers", element: <AllUsers /> },
        { path: "ActiveUsers", element: <ActiveUsers /> },
        { path: "BannedUsers", element: <BannedUsers /> },
        { path: "InactiveUsers", element: <InactiveUsers /> },

        // { path: "*", element: <PageNotFound /> },
      ],
    },
  ]);

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* top-level wrapper for Tailwind dark mode */}
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 py-3">
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
