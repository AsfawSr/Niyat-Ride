import React from "react";
import { Box, Grid } from "@mui/material";
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";
import StatCard from "../Components/StatCard";
import RideLineChart from "../Components/RideLineChart";
import MonthlyBarChart from "../Components/MonthlyBarChart";
import RecentRidesTable from "../Components/RecentRidesTable";

// --- mock data (replace with API later) ---
const kpis = [
  { title: "Total Rides", value: "23,456" },
  { title: "Active Drivers", value: "1,234" },
  { title: "Active Passengers", value: "5,678" },
  { title: "Cancellations", value: "456" },
];

const weekly = [
  { label: "W1", rides: 240, prev: 260 },
  { label: "W2", rides: 210, prev: 230 },
  { label: "W3", rides: 200, prev: 220 },
  { label: "W4", rides: 190, prev: 210 },
  { label: "W5", rides: 170, prev: 200 },
  { label: "W6", rides: 175, prev: 180 },
];

const monthly = [
  { month: "Jan", value: 320 },
  { month: "Feb", value: 420 },
  { month: "Mar", value: 540 },
  { month: "Apr", value: 600 },
  { month: "May", value: 650 },
  { month: "Jun", value: 780 },
];

const recent = [
  { id: "001", passenger: "John Smith", driver: "Mary Johnson", status: "Completed", date: "2023-10-01" },
  { id: "002", passenger: "Jane Doe", driver: "Michael Brown", status: "Cancelled", date: "2023-10-01" },
  { id: "003", passenger: "Anna Lee", driver: "Chris White", status: "Ongoing", date: "2023-10-01" },
];

export default function Dashboard() {
  return (
    <Box sx={{ display: "flex", bgcolor: "#f6f7fb", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <Topbar />

        <Box component="main" sx={{ p: 3 }}>
          {/* KPI cards */}
          <Grid container spacing={2} mb={2}>
            {kpis.map((k) => (
              <Grid key={k.title} item xs={12} sm={6} md={3}>
                <StatCard title={k.title} value={k.value} />
              </Grid>
            ))}
          </Grid>

          {/* Charts */}
          <Grid container spacing={6} mb={8}>
            <Grid item xs={12} md={7}>
              <RideLineChart data={weekly} />
            </Grid>
            <Grid item xs={12} md={5}>
              <MonthlyBarChart data={monthly} />
            </Grid>
          </Grid>

          {/* Recent table */}
          <Box sx={{ mr: 5 }}>   {/* ml = margin-left */}
  <RecentRidesTable rows={recent} />
</Box>

        </Box>
      </Box>
    </Box>
  );
}
