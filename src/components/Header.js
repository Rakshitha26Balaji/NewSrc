import React from "react";
import { Box, Typography } from "@mui/material";

export default function Header() {
  return (
    <Box
      sx={{
        width: "100%",
        padding: 2,
        backgroundColor: "#1976d2",  // Blue header
        color: "white",
        textAlign: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >
      <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
        Marketing Leads Dashboard
      </Typography>
    </Box>
  );
}
