// import { useState } from "react";
// import SearchBar from "./SearchBar";
// import Pagination from "./Pagination";
// import UserRow from "./UserRow";
// import ViewUserModal from "./modals/ViewUserModal";
// import EditUserModal from "./modals/EditUserModal";
// import "./UserTable.css"; // 👈 import styles

// const UserTable = ({ users, onDeleteSuccess, onUpdateSuccess }) => {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [editUser, setEditUser] = useState(null);

//   return (
//     <div class="user-table-container ">
//       <div class="user-table-wrapper">
//         <table class="user-table">
//           <thead>
//             <tr class="user-table-header-row">
//               <th class="user-table-header">Profile</th>
//               <th class="user-table-header">User ID</th>
//               <th class="user-table-header">Name</th>
//               <th class="user-table-header">Phone</th>
//               <th class="user-table-header">Role</th>
//               <th class="user-table-header">Status</th>
//               <th class="user-table-header">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <UserRow
//                 key={user.userId}
//                 user={user}
//                 onView={() => setSelectedUser(user)}
//                 onEdit={() => setEditUser(user)}
//                 onDelete={onDeleteSuccess}
//               />
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <ViewUserModal
//         user={selectedUser}
//         onCancel={() => setSelectedUser(null)}
//       />
//       {editUser && (
//         <EditUserModal
//           user={editUser}
//           onCancel={() => setEditUser(null)}
//           onUpdateSuccess={onUpdateSuccess}
//         />
//       )}
//     </div>
//   );
// };

// export default UserTable;

import { useState } from "react";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import UserRow from "./UserRow";
import ViewUserModal from "./modals/ViewUserModal";
import EditUserModal from "./modals/EditUserModal";
const UserTable = ({ users, onDeleteSuccess, onUpdateSuccess }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  return (
    <div className="space-y-4 bg-red-500">
      <p>hi</p>
      <div className="overflow-hidden rounded-lg border border-gray-300">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#dfdfdf] dark:bg-gray-700 border-b border-gray-400 dark:border-gray-800">
              <th className="p-3">Profile</th>
              <th className="p-3">User ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow
                key={user.userId}
                user={user}
                onView={() => setSelectedUser(user)}
                onEdit={() => setEditUser(user)}
                onDelete={onDeleteSuccess}
              />
            ))}
          </tbody>
        </table>
      </div>
      <ViewUserModal
        user={selectedUser}
        onCancel={() => setSelectedUser(null)}
      />
      {editUser && (
        <EditUserModal
          user={editUser}
          onCancel={() => setEditUser(null)}
          onUpdateSuccess={onUpdateSuccess} // <-- update table after save
        />
      )}
    </div>
  );
};

export default UserTable;
