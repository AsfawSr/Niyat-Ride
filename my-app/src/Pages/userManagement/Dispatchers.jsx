import React from "react";
import UserTable from "../../components/usermanagement/UserTable";
import UserStats from "../../components/usermanagement/UserStats";
import Sidebar from "../../Components/Sidebar";

const Dispatchers = () => {
  return (
    <div className="flex">
      <Sidebar />
      {/* Main User Table Panel */}
      <div className="dark:bg-gray-900 dark:shadow-gray-700">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
          Dispatchers{" "}
        </h1>
        {/* Pass filter="banned" to show only banned users */}
        <UserTable filter="dispatchers" />
      </div>
      <div className="col-span-4">
        <UserStats />
      </div>
    </div>
  );
};

export default Dispatchers;
