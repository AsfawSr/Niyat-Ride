import React from "react";
import UserTable from "../../components/usermanagement/UserTable";
import UserStats from "../../components/usermanagement/UserStats";

const ActiveUsers = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4">Active Users</h1>
        <UserTable filter="active" />
      </div>
      <div className="col-span-4">
        <UserStats />
      </div>
    </div>
  );
};

export default ActiveUsers;
