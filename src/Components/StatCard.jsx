import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default function StatCard({ title, value }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
        <Typography variant="h5" mt={1} fontWeight={800}>{value}</Typography>
      </CardContent>
    </Card>
  );
}
