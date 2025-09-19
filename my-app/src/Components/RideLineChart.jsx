// src/Components/RideLineChart.jsx
import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function RideLineChart({ data }) {
  // Fallback if API doesn’t provide data
  const chartData = data && data.length > 0 ? data : [
    { label: "W1", rides: 0, prev: 0 },
    { label: "W2", rides: 0, prev: 0 },
    { label: "W3", rides: 0, prev: 0 },
    { label: "W4", rides: 0, prev: 0 },
  ];

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Weekly Rides
        </Typography>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            {/* Main rides line */}
            <Line
              type="monotone"
              dataKey="rides"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={false}
            />
            {/* Previous rides line (for comparison) */}
            <Line
              type="monotone"
              dataKey="prev"
              stroke="#c7c7d1"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
