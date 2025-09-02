import React from "react";

const activities = [
  { action: "Password Reset", user: "John Doe", date: "April 25, 2024" },
  { action: "User Banned", user: "Alice Smith", date: "April 24, 2024" },
];

const RecentActivities = () => {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="p-2">Action</th>
            <th className="p-2">User</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{activity.action}</td>
              <td className="p-2">{activity.user}</td>
              <td className="p-2">{activity.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivities;
