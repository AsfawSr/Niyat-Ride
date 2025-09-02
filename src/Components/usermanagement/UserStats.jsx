import React from "react";

const stats = [
  { label: "Total Users", value: "10,250" },
  { label: "Active Users", value: "8,700" },
  { label: "Inactive Users", value: "1,200" },
  { label: "Banned Users", value: "350" },
];

const roles = [
  { label: "Passengers", color: "bg-blue-600", height: "80%" },
  { label: "Drivers", color: "bg-gray-600", height: "60%" },
];

const UserStats = () => {
  return (
    <div className="space-y-4 flex flex-col ">
      {/* User Counts */}
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="w-100 text-center bg-white  dark:bg-black p-4 rounded shadow"
        >
          <p className="text-gray-500">{stat.label}</p>
          <p className="dark:text-white font-semibold">{stat.value}</p>
        </div>
      ))}

      {/* Role Distribution */}
      <div className="bg-white dark:bg-black p-4 rounded shadow">
        <p className="text-gray-500">Role Distribution</p>
        <div className="h-32 bg-gray-100 flex items-end justify-around">
          {roles.map((role) => (
            <div
              key={role.label}
              className={`${role.color} w-8`}
              style={{ height: role.height }}
            ></div>
          ))}
        </div>
        <div className="flex justify-around mt-2">
          {roles.map((role) => (
            <span key={role.label}>{role.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserStats;

// import React from "react";

// const UserStats = () => {
//   return (
//     <div className="space-y-4">
//       <div className="bg-white p-4 rounded shadow">
//         <p className="text-gray-500">Total Users</p>
//         <p className="text-2xl font-semibold">10,250</p>
//       </div>
//       <div className="bg-white p-4 rounded shadow">
//         <p className="text-gray-500">Active Users</p>
//         <p className="text-2xl font-semibold">8,700</p>
//       </div>
//       <div className="bg-white p-4 rounded shadow">
//         <p className="text-gray-500">Inactive Users</p>
//         <p className="text-2xl font-semibold">1,200</p>
//       </div>
//       <div className="bg-white p-4 rounded shadow">
//         <p className="text-gray-500">Banned Users</p>
//         <p className="text-2xl font-semibold">350</p>
//       </div>
//       <div className="bg-white p-4 rounded shadow">
//         <p className="text-gray-500">Role Distribution</p>
//         <div className="h-32 bg-gray-100 flex items-end justify-around">
//           <div className="w-8 bg-blue-600" style={{ height: "80%" }}></div>
//           <div className="w-8 bg-gray-600" style={{ height: "60%" }}></div>
//         </div>
//         <div className="flex justify-around mt-2">
//           <span>Passengers</span>
//           <span>Drivers</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserStats;
