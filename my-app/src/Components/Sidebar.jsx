import React from "react";
import { NavLink } from "react-router-dom";
import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { MdDashboard, MdPeople, MdDirectionsCar, MdAssessment, MdMap, MdAssignment } from "react-icons/md";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: <MdDashboard /> },
  { to: "/admin/users", label: "User Management", icon: <MdPeople /> },
  { to: "/admin/rides", label: "Ride Management", icon: <MdDirectionsCar /> },
  { to: "/admin/reports", label: "Reports & Analytics", icon: <MdAssessment /> },
  { to: "/dispatcher", label: "Dispatcher Dashboard", icon: <MdMap /> },
  { to: "/dispatcher/assign", label: "Manual Assignment", icon: <MdAssignment /> },
];

export default function Sidebar() {
  return (
    <Box
      component="aside"
      sx={{
        width: 220,
        flexShrink: 0,
        bgcolor: "#111",
        color: "#fff",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <Box sx={{ px: 2, py: 2, fontWeight: 700, display: "flex", alignItems: "center", gap: 1, fontSize: 18 }}>
        🚗 Nyat Ride
      </Box>
      <List sx={{ pt: 0 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              textDecoration: "none",
              color: "#fff",
              background: isActive ? "#1f2937" : "transparent",
              display: "block",
            })}
          >
            <ListItemButton sx={{ gap: 1.5, py: 1.2 }}>
              <Box style={{ fontSize: 20 }}>{item.icon}</Box>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </NavLink>
        ))}
      </List>
    </Box>
  );
}
