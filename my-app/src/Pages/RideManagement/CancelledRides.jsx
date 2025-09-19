import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box, Card, CardContent, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TablePagination, Tooltip, TableContainer, Paper
} from "@mui/material";
import { FaEye } from "react-icons/fa";
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";

export default function CancelledRides() {
  const { rides } = useSelector((state) => state.rides);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewRide, setViewRide] = useState(null);

  const cancelledRides = useMemo(
    () => rides.filter((r) => r.status === "CANCELLED"),
    [rides]
  );

  const pageRows = cancelledRides.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ display: "flex", bgcolor: "#f6f7fb", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        
        <Box sx={{ p: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Cancelled Rides</Typography>
              <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ride ID</TableCell>
                      <TableCell>Passenger</TableCell>
                      <TableCell>Driver</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Fare</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pageRows.map((ride) => (
                      <TableRow key={ride.id} hover>
                        <TableCell>{ride.id}</TableCell>
                        <TableCell>{ride.passengerName}</TableCell>
                        <TableCell>{ride.driverName}</TableCell>
                        <TableCell>{ride.cancelledAt?.split("T")[0]}</TableCell>
                        <TableCell>$0.00</TableCell>
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
                  count={cancelledRides.length}
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
              <Typography><b>Pickup:</b> {viewRide.pickupAddress}</Typography>
              <Typography><b>Drop-off:</b> {viewRide.dropoffAddress}</Typography>
              <Typography><b>Cancelled At:</b> {viewRide.cancelledAt}</Typography>
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
