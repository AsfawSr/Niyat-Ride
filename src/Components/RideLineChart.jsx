import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export default function RideLineChart({ data }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Weekly Rides</Typography>
        <ResponsiveContainer width={700} height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            {/* main line */}
            <Line type="monotone" dataKey="rides" stroke="#4f46e5" strokeWidth={3} dot={false} />
            {/* faint comparison line */}
            <Line type="monotone" dataKey="prev" stroke="#c7c7d1" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
