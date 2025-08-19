import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  MdDashboard,
  MdPeople,
  MdDirectionsCar,
  MdAssessment,
  MdMap,
  MdAssignment,
  MdExpandLess,
  MdExpandMore,
} from "react-icons/md";

export default function Sidebar() {
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <MdDashboard /> },
    { label: "User Management", icon: <MdPeople />, isDropdown: true }, // Dropdown
    { to: "/admin/rides", label: "Ride Management", icon: <MdDirectionsCar /> },
    {
      to: "/admin/reports",
      label: "Reports & Analytics",
      icon: <MdAssessment />,
    },
    { to: "/dispatcher", label: "Dispatcher Dashboard", icon: <MdMap /> },
    {
      to: "/dispatcher/assign",
      label: "Manual Assignment",
      icon: <MdAssignment />,
    },
  ];

  const userSubItems = [
    { to: "/admin/AllUsers", label: "All Users" },
    { to: "/admin/ActiveUsers", label: "Active Users" },
    { to: "/admin/InactiveUsers", label: "Inactive Users" },
    { to: "/admin/BannedUsers", label: "Banned Users" },
  ];

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
      {/* Logo */}
      <Box
        sx={{
          px: 2,
          py: 2,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontSize: 18,
        }}
      >
        🚗 Nyat Ride
      </Box>

      {/* Main Navigation */}
      <List sx={{ pt: 0 }}>
        {navItems.map((item) => {
          if (item.isDropdown) {
            return (
              <Box key={item.label}>
                <ListItemButton
                  onClick={() => setOpenUserMenu(!openUserMenu)}
                  sx={{ gap: 1.5, py: 1.2 }}
                >
                  <Box style={{ fontSize: 20 }}>{item.icon}</Box>
                  <ListItemText primary={item.label} />
                  {openUserMenu ? <MdExpandLess /> : <MdExpandMore />}
                </ListItemButton>

                <Collapse in={openUserMenu} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {userSubItems.map((subItem) => (
                      <NavLink
                        key={subItem.to}
                        to={subItem.to}
                        style={({ isActive }) => ({
                          textDecoration: "none",
                          color: "#fff",
                          background: isActive ? "#1f2937" : "transparent",
                          display: "block",
                        })}
                      >
                        <ListItemButton sx={{ pl: 6, py: 1 }}>
                          <ListItemText primary={subItem.label} />
                        </ListItemButton>
                      </NavLink>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          }

          return (
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
          );
        })}
      </List>
    </Box>
  );
}
