import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

export default function DispatcherLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}
