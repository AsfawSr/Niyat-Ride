import React from "react";
import { Box, IconButton } from "@mui/material";
import { FiBell, FiUser } from "react-icons/fi";
import { NavLink } from "react-router-dom";

export default function Topbar() {
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
      <IconButton>
        <FiBell />
      </IconButton>
      <IconButton>
        <NavLink to="/logout" className="text-xxs">
          <FiUser className="inline-block mr-1" />
          Logout
        </NavLink>
      </IconButton>
    </Box>
  );
}
