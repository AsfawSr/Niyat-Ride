import React, { useState } from "react";
import { Box, IconButton, Menu, MenuItem, Divider } from "@mui/material";
import { FiBell, FiUser } from "react-icons/fi";
import { NavLink } from "react-router-dom";

export default function Topbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Open menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      component="header"
      sx={{
        height: 56,
        borderBottom: "1px solid #eee",
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        bgcolor: "#fff",
        position: "sticky",
        top: 0,
        marginRight: 6,
      }}
    >
      {/* Notifications */}
      <IconButton>
        <FiBell />
      </IconButton>

      {/* User Menu */}
      <IconButton onClick={handleMenuOpen}>
        <FiUser />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: " bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem component={NavLink} to="/profile" onClick={handleMenuClose}>
          Profile
        </MenuItem>
        <Divider />
        <MenuItem component={NavLink} to="/logout" onClick={handleMenuClose}>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
