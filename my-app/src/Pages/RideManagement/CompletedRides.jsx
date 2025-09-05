import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TablePagination,
  Tooltip,
  TableContainer,
  Paper,
  Chip,
} from "@mui/material";
import { FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";
// import { useRides } from "../../context/RidesContext";
export default function CompletedRides() {
  const rides = useSelector((state) => state.rides.rides);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewRide, setViewRide] = useState(null);
  const completedRides = useMemo(
    () => rides.filter((r) => r.status === "Completed"),
    [rides]
  );
  const pageRows = completedRides.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  return (
    <Box sx={{ display: "flex", bgcolor: "#f6f7fb", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <Topbar />
        <Box sx={{ p: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Completed Rides
              </Typography>

              <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}
                      >
                        Ride ID
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}
                      >
                        Passenger
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}
                      >
                        Driver
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}
                      >
                        Date
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}
                      >
                        Fare
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}
                      >
                        Completed By
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pageRows.map((ride) => (
                      <TableRow key={ride.id} hover>
                        <TableCell>{ride.id}</TableCell>
                        <TableCell>{ride.passenger}</TableCell>
                        <TableCell>{ride.driver}</TableCell>
                        <TableCell>{ride.date}</TableCell>
                        <TableCell>{ride.fare}</TableCell>
                        <TableCell>
                          {ride.completedBy ? (
                            <Chip
                              label={ride.completedBy}
                              color="success"
                              size="small"
                            />
                          ) : (
                            <Chip label="System" color="default" size="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View">
                            <IconButton
                              color="primary"
                              onClick={() => setViewRide(ride)}
                            >
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

      <Dialog
        open={!!viewRide}
        onClose={() => setViewRide(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Ride Details</DialogTitle>
        <DialogContent dividers>
          {viewRide && (
            <>
              <Typography>
                <b>Ride ID:</b> {viewRide.id}
              </Typography>
              <Typography>
                <b>Passenger:</b> {viewRide.passenger}
              </Typography>
              <Typography>
                <b>Driver:</b> {viewRide.driver}
              </Typography>
              <Typography>
                <b>Date:</b> {viewRide.date}
              </Typography>
              <Typography>
                <b>Fare:</b> {viewRide.fare}
              </Typography>
              <Typography>
                <b>Pickup:</b> {viewRide.pickup}
              </Typography>
              <Typography>
                <b>Drop-off:</b> {viewRide.dropoff}
              </Typography>
              <Typography>
                <b>Completed By:</b> {viewRide.completedBy || "System"}
              </Typography>
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
