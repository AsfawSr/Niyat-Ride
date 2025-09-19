// src/Pages/Dashboard.jsx
import React, { useEffect, useMemo } from "react";
import { Box, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";
import StatCard from "../Components/StatCard";
import RideLineChart from "../Components/RideLineChart";
import MonthlyBarChart from "../Components/MonthlyBarChart";
import RecentRidesTable from "../Components/RecentRidesTable";

import {
  fetchDashboardSummary,
  fetchUserSummary,
  fetchRideSummary,
  fetchRecentRides,
} from "../store/dashboardSlice";

// fallback mock data (keeps UI friendly until backend provides expected shape)
const MOCK_WEEKLY = [
  { label: "W1", rides: 240, prev: 260 },
  { label: "W2", rides: 210, prev: 230 },
  { label: "W3", rides: 200, prev: 220 },
  { label: "W4", rides: 190, prev: 210 },
  { label: "W5", rides: 170, prev: 200 },
  { label: "W6", rides: 175, prev: 180 },
];
const MOCK_MONTHLY = [
  { month: "Jan", value: 320 },
  { month: "Feb", value: 420 },
  { month: "Mar", value: 540 },
  { month: "Apr", value: 600 },
  { month: "May", value: 650 },
  { month: "Jun", value: 780 },
];

export default function Dashboard() {
  const dispatch = useDispatch();

  // be defensive: state.dashboard might be undefined until store is wired
  const dashboardState = useSelector((s) => s.dashboard ?? {});
  const {
    dashboardSummary,
    userSummary,
    rideSummary,
    recentRides = [],
    status,
  } = dashboardState;

  useEffect(() => {
    // fetch all necessary dashboard data
    dispatch(fetchDashboardSummary());
    dispatch(fetchUserSummary());
    dispatch(fetchRideSummary());
    dispatch(fetchRecentRides());
  }, [dispatch]);

  // KPI cards
  const kpis = useMemo(() => {
    return [
      {
        title: "Total Rides",
        value:
          dashboardSummary?.totalRides ??
          rideSummary?.totalRidesCount ??
          "—",
      },
      {
        title: "Active Drivers",
        value: dashboardSummary?.activeDrivers ?? "—",
      },
      {
        title: "Active Passengers",
        value: userSummary?.totalCustomers ?? userSummary?.totalUsers ?? "—",
      },
      {
        title: "Cancellations",
        value:
          rideSummary?.cancelledRidesCount ??
          rideSummary?.cancelledCount ??
          "—",
      },
    ];
  }, [dashboardSummary, userSummary, rideSummary]);

  // Weekly chart data (try to derive from rideSummary.revenueByPeriod or fallback)
  const weekly = useMemo(() => {
    // if rideSummary.revenueByPeriod is object with keys we can map to an array
    const r = rideSummary?.revenueByPeriod;
    if (r && typeof r === "object") {
      // try to pick last 6 keys
      const entries = Object.entries(r).slice(0, 6);
      return entries.map(([label, value]) => ({
        label,
        rides: Number(value) || 0,
        prev: 0,
      }));
    }
    return MOCK_WEEKLY;
  }, [rideSummary]);

  // Monthly bar data: try to derive from rideSummary.revenueByPeriod using month name keys or fallback
  const monthly = useMemo(() => {
    const r = rideSummary?.revenueByPeriod;
    if (r && typeof r === "object") {
      // if keys look like months, map them; otherwise take first 6 entries
      const entries = Object.entries(r).slice(0, 6);
      return entries.map(([k, v]) => ({ month: k, value: Number(v) || 0 }));
    }
    return MOCK_MONTHLY;
  }, [rideSummary]);

  // Recent rides: normalize (attempt to use fields returned by backend)
  const recent = (recentRides || []).map((dto) => ({
    id: dto.id ?? dto.rideId ?? dto._id ?? "n/a",
    passengerName: dto.passengerName ?? dto.customerName ?? dto.customer ?? "",
    driverName: dto.driverName ?? dto.driver ?? "",
    status: dto.status ?? dto.state ?? "Unknown",
    requestedAt: dto.requestedAt ?? dto.requested_at ?? dto.date,
    completedAt: dto.completedAt ?? dto.completed_at,
  }));

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        
        <Box component="main" sx={{ p: 3 }}>
          {/* Loading indicator */}
          {status === "loading" && <div>Loading dashboard...</div>}

          {/* KPI cards */}
          <Grid container spacing={2} mb={2}>
            {kpis.map((k) => (
              <Grid key={k.title} item xs={12} sm={6} md={3}>
                <StatCard title={k.title} value={k.value ?? "—"} />
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
          <Box sx={{ mr: 5 }}>
            <RecentRidesTable rows={recent.length ? recent : []} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
