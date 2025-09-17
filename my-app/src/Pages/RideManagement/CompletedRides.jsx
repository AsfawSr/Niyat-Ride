import React, { useMemo, useState } from "react";
import {
  Box, Card, CardContent, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TablePagination, Tooltip, TableContainer, Paper, Chip
} from "@mui/material";
import { FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";

export default function CompletedRides() {
  const { rides } = useSelector((state) => state.rides);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewRide, setViewRide] = useState(null);

  const completedRides = useMemo(
    () => rides.filter((r) => r.status === "COMPLETED"),
    [rides]
  );

  const pageRows = completedRides.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ display: "flex", bgcolor: "#f6f7fb", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        
        <Box sx={{ p: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Completed Rides</Typography>
              <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ride ID</TableCell>
                      <TableCell>Passenger</TableCell>
                      <TableCell>Driver</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Fare</TableCell>
                      <TableCell>Completed By</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pageRows.map((ride) => (
                      <TableRow key={ride.id} hover>
                        <TableCell>{ride.id}</TableCell>
                        <TableCell>{ride.passengerName}</TableCell>
                        <TableCell>{ride.driverName}</TableCell>
                        <TableCell>{ride.completedAt?.split("T")[0]}</TableCell>
                        <TableCell>{ride.finalCost ? `$${ride.finalCost}` : "-"}</TableCell>
                        <TableCell>
                          <Chip label={ride.completedBy || "System"} color="success" size="small" />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View">
                            <IconButton color="primary" onClick={() => setViewRide(ride)}>
                              <FaEye />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <TablePagination
                  component="div"
                  count={completedRides.length}
                  page={page}
                  onPageChange={(_e, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Dialog open={!!viewRide} onClose={() => setViewRide(null)} fullWidth maxWidth="sm">
        <DialogTitle>Ride Details</DialogTitle>
        <DialogContent dividers>
          {viewRide && (
            <>
              <Typography><b>Ride ID:</b> {viewRide.id}</Typography>
              <Typography><b>Passenger:</b> {viewRide.passengerName}</Typography>
              <Typography><b>Driver:</b> {viewRide.driverName}</Typography>
              <Typography><b>Fare:</b> {viewRide.finalCost}</Typography>
              <Typography><b>Pickup:</b> {viewRide.pickupAddress}</Typography>
              <Typography><b>Drop-off:</b> {viewRide.dropoffAddress}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewRide(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
