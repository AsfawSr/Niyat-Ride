import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function MonthlyBarChart({ data }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Monthly Rides
        </Typography>
        <ResponsiveContainer width={800} height={260}>
          <BarChart layout="vertical" data={data} margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="month" />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
