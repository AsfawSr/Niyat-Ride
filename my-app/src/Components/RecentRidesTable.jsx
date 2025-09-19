// src/Components/RecentRidesTable.jsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export default function RecentRidesTable({ rows }) {
  const tableData = rows && rows.length > 0 ? rows : [];

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Ride Activity
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ride ID</TableCell>
              <TableCell>Passenger</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id || r.rideId}</TableCell>
                <TableCell>{r.passengerName || r.customerName || r.customerId}</TableCell>
                <TableCell>{r.driverName || r.driverId}</TableCell>
                <TableCell>{r.status}</TableCell>
                <TableCell>
                  {r.requestedAt?.split("T")[0] ||
                    r.startedAt?.split("T")[0] ||
                    r.completedAt?.split("T")[0] ||
                    "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
