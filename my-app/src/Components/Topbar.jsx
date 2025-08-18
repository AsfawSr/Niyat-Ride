import React from "react";
import { Box, IconButton } from "@mui/material";
import { FiBell, FiUser } from "react-icons/fi";

export default function Topbar() {
  return (
    <Box
      component="header"
      sx={{
        height: 56,
        borderBottom: "1px solid #eee",
        px: 2,
        display:"flex",
        alignItems: "center",
        justifyContent: "flex-end",
        bgcolor: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <IconButton><FiBell /></IconButton>
      <IconButton><FiUser /></IconButton>
    </Box>
  );
}
