import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Drawer,
  IconButton,
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
  MdExpandLess,
  MdExpandMore,
  MdMenu,
  MdClose,
} from "react-icons/md";

export default function Sidebar() {
  const location = useLocation();
  const { role } = useSelector((state) => state.auth); // role = "admin" | "dispatcher"

  const [openSidebar, setOpenSidebar] = useState(true);

  // ✅ Persisted states for menus
  const [openUserMenu, setOpenUserMenu] = useState(() => {
    const saved = localStorage.getItem("nyat_open_user_menu");
    if (saved !== null) return saved === "true";
    return location.pathname.startsWith("/AllUsers");
  });

  const [openRides, setOpenRides] = useState(() => {
    const saved = localStorage.getItem("nyat_open_rides");
    if (saved !== null) return saved === "true";
    return location.pathname.startsWith("/admin/rides");
  });

  const [openDispatcherMenu, setOpenDispatcherMenu] = useState(() => {
    const saved = localStorage.getItem("nyat_open_dispatcher_menu");
    if (saved !== null) return saved === "true";
    return location.pathname.startsWith("/dispatcher");
  });

  const toggleSidebar = () => setOpenSidebar(!openSidebar);

  // ✅ Auto-open menus when navigating
  useEffect(() => {
    if (location.pathname.startsWith("/admin/rides")) setOpenRides(true);

    const isUserRoute = [
      "/AllUsers",
      "/drivers",
      "/passengers",
      "/dispatchers",
    ].some((r) => location.pathname.startsWith(r));
    if (isUserRoute) setOpenUserMenu(true);

    if (
      [
        "/dispatcher",
        "/dispatcher/livemap",
        "/dispatcher/manualAssignment",
      ].some((r) => location.pathname.startsWith(r))
    )
      setOpenDispatcherMenu(true);
  }, [location.pathname]);

  // ✅ Sync menu states to localStorage
  useEffect(() => {
    localStorage.setItem("nyat_open_rides", String(openRides));
  }, [openRides]);

  useEffect(() => {
    localStorage.setItem("nyat_open_user_menu", String(openUserMenu));
  }, [openUserMenu]);

  useEffect(() => {
    localStorage.setItem(
      "nyat_open_dispatcher_menu",
      String(openDispatcherMenu)
    );
  }, [openDispatcherMenu]);

  const listItemSx = {
    gap: 1.5,
    py: 1.2,
    justifyContent: openSidebar ? "flex-start" : "center",
    "&:hover": { bgcolor: "rgba(37, 99, 235, 0.2)" }, // transparent blue hover
    borderRadius: "8px",
    transition: "background-color 0.2s",
  };

  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    color: "#fff",
    background: isActive ? "rgba(37, 99, 235, 0.3)" : "transparent",
    display: "block",
  });

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        open={openSidebar}
        sx={{
          width: openSidebar ? 240 : 70,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: openSidebar ? 240 : 70,
            boxSizing: "border-box",
            backgroundColor: "#111",
            color: "#fff",
            transition: "width 0.3s ease-in-out",
            overflowX: "hidden",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: openSidebar ? "space-between" : "center",
            px: 2,
            py: 2,
            borderBottom: "1px solid #333",
          }}
        >
          {openSidebar && (
            <Box sx={{ fontWeight: 700, fontSize: 18 }}>🚗 Nyat Ride</Box>
          )}
          <IconButton onClick={toggleSidebar} sx={{ color: "#fff" }}>
            {openSidebar ? <MdClose /> : <MdMenu />}
          </IconButton>
        </Box>

        {/* Navigation List */}
        <List sx={{ pt: 1 }}>
//////
          {/* ===== Admin Menus ===== */}
          {role === "admin" && (
            <>
              {/* Dashboard */}
              <NavLink to="/dashboard" style={linkStyle} end>
                <ListItemButton sx={listItemSx}>
                  <MdDashboard style={{ fontSize: 20 }} />
                  {openSidebar && <ListItemText primary="Dashboard" />}
                </ListItemButton>
              </NavLink>

              {/* User Management Dropdown */}
              <ListItemButton
                onClick={() => setOpenUserMenu(!openUserMenu)}
                sx={listItemSx}
              >
                <MdPeople style={{ fontSize: 20 }} />
                {openSidebar && <ListItemText primary="User Management" />}
                {openSidebar &&
                  (openUserMenu ? <MdExpandLess /> : <MdExpandMore />)}
              </ListItemButton>
              <Collapse
                in={openUserMenu && openSidebar}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {[
                    { to: "/AllUsers", label: "All Users" },
                    { to: "/drivers", label: "Drivers" },
                    { to: "/passengers", label: "Passengers " },
                    { to: "/dispatchers", label: "Dispatchers" },
                  ].map((sub) => (
                    <NavLink key={sub.to} to={sub.to} style={linkStyle}>
                      <ListItemButton sx={{ ...listItemSx, pl: 6 }}>
                        {openSidebar && (
                          <ListItemText
                            primary={sub.label}
                            primaryTypographyProps={{
                              fontSize: 14,
                              fontWeight: 500,
                            }}
                          />
                        )}
                      </ListItemButton>
                    </NavLink>
                  ))}
                </List>
              </Collapse>

              {/* Ride Management */}
              <ListItemButton
                onClick={() => setOpenRides((v) => !v)}
                sx={listItemSx}
              >
                <MdDirectionsCar style={{ fontSize: 20 }} />
                {openSidebar && <ListItemText primary="Ride Management" />}
                {openSidebar &&
                  (openRides ? <MdExpandLess /> : <MdExpandMore />)}
              </ListItemButton>
              <Collapse
                in={openRides && openSidebar}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {[
                    { to: "/admin/rides", label: "All Rides" },
                    { to: "/admin/ongoing", label: "Ongoing Rides" },
                    { to: "/admin/completed", label: "Completed Rides" },
                    { to: "/admin/cancelled", label: "Cancelled Rides" },
                  ].map((sub) => (
                    <NavLink key={sub.to} to={sub.to} style={linkStyle}>
                      <ListItemButton sx={{ ...listItemSx, pl: 6 }}>
                        {openSidebar && (
                          <ListItemText
                            primary={sub.label}
                            primaryTypographyProps={{
                              fontSize: 14,
                              fontWeight: 500,
                            }}
                          />
                        )}
                      </ListItemButton>
                    </NavLink>
                  ))}
                </List>
              </Collapse>

              {/* Reports */}
              <NavLink to="/admin/reports" style={linkStyle}>
                <ListItemButton sx={listItemSx}>
                  <MdAssessment style={{ fontSize: 20 }} />
                  {openSidebar && (
                    <ListItemText primary="Reports & Analytics" />
                  )}
                </ListItemButton>
              </NavLink>
            </>
          )}

          {/* ===== Dispatcher Menus (shared with admin too) ===== */}
/////////////
          {(role === "admin" || role === "dispatcher") && (
            <>
              <ListItemButton
                onClick={() => setOpenDispatcherMenu((v) => !v)}
                sx={listItemSx}
              >
                <MdMap style={{ fontSize: 20 }} />
                {openSidebar && <ListItemText primary="Dispatcher" />}
                {openSidebar &&
                  (openDispatcherMenu ? <MdExpandLess /> : <MdExpandMore />)}
              </ListItemButton>
              <Collapse
                in={openDispatcherMenu && openSidebar}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {[
                    { to: "/dispatcher/livemap", label: "Live Map" },
                    {
                      to: "/dispatcher/manualAssignment",
                      label: "Manual Assignment",
                    },
                  ].map((sub) => (
                    <NavLink key={sub.to} to={sub.to} style={linkStyle}>
                      <ListItemButton sx={{ ...listItemSx, pl: 6 }}>
                        {openSidebar && (
                          <ListItemText
                            primary={sub.label}
                            primaryTypographyProps={{
                              fontSize: 14,
                              fontWeight: 500,
                            }}
                          />
                        )}
                      </ListItemButton>
                    </NavLink>
                  ))}
                </List>
              </Collapse>
            </>
          )}
        </List>
      </Drawer>
    </Box>
  );
}
