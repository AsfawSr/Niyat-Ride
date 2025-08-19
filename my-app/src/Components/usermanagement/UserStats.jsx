import React from "react";

const UserStats = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded shadow">
        <p className="text-gray-500">Total Users</p>
        <p className="text-2xl font-semibold">10,250</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <p className="text-gray-500">Active Users</p>
        <p className="text-2xl font-semibold">8,700</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <p className="text-gray-500">Inactive Users</p>
        <p className="text-2xl font-semibold">1,200</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <p className="text-gray-500">Banned Users</p>
        <p className="text-2xl font-semibold">350</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <p className="text-gray-500">Role Distribution</p>
        <div className="h-32 bg-gray-100 flex items-end justify-around">
          <div className="w-8 bg-blue-600" style={{ height: "80%" }}></div>
          <div className="w-8 bg-gray-600" style={{ height: "60%" }}></div>
        </div>
        <div className="flex justify-around mt-2">
          <span>Passengers</span>
          <span>Drivers</span>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
