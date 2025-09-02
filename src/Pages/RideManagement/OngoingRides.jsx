import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux"; // ✅ NEW: Import Redux hooks
import {
  Box, Card, CardContent, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TablePagination, Tooltip, TableContainer, Paper
} from "@mui/material";
import { FaEye, FaTrash } from "react-icons/fa";
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";
import { cancelRide, finishRide } from "../../store/ridesSlice"; // ✅ NEW: Import actions

export default function OngoingRides() {
  // ✅ NEW: use useSelector to get rides from the store, and useDispatch to dispatch actions
  const rides = useSelector((state) => state.rides.rides);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewRide, setViewRide] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  const ongoingRides = useMemo(
    () => rides.filter((r) => r.status === "Ongoing"),
    [rides]
  );

  const pageRows = ongoingRides.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ display: "flex", bgcolor: "#f6f7fb", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <Topbar />
        <Box sx={{ p: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Ongoing Rides</Typography>

              <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}>Ride ID</TableCell>
                      <TableCell sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}>Passenger</TableCell>
                      <TableCell sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}>Driver</TableCell>
                      <TableCell sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}>Fare</TableCell>
                      <TableCell sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}>Actions</TableCell>
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
                          <Tooltip title="View">
                            <IconButton color="primary" onClick={() => setViewRide(ride)}>
                              <FaEye />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel Ride">
                            <IconButton color="error" onClick={() => setCancelTarget(ride)}>
                              <FaTrash />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Finish Ride">
                            <IconButton
                              color="success"
                              onClick={() => dispatch(finishRide(ride.id))} // ✅ NEW: Dispatch the finishRide action
                            >
                              ✅
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
                  count={ongoingRides.length}
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

      {/* ----- View Modal ----- */}
      <Dialog open={!!viewRide} onClose={() => setViewRide(null)} fullWidth maxWidth="sm">
        <DialogTitle>Ride Details</DialogTitle>
        <DialogContent dividers>
          {viewRide && (
            <>
              <Typography><b>Ride ID:</b> {viewRide.id}</Typography>
              <Typography><b>Passenger:</b> {viewRide.passenger}</Typography>
              <Typography><b>Driver:</b> {viewRide.driver}</Typography>
              <Typography><b>Date:</b> {viewRide.date}</Typography>
              <Typography><b>Fare:</b> {viewRide.fare}</Typography>
              <Typography><b>Pickup:</b> {viewRide.pickup}</Typography>
              <Typography><b>Drop-off:</b> {viewRide.dropoff}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewRide(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ----- Cancel Confirm Modal ----- */}
      <Dialog open={!!cancelTarget} onClose={() => setCancelTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Cancel Ride</DialogTitle>
        <DialogContent dividers>
          {cancelTarget && (
            <Typography>
              Are you sure you want to cancel <b>{cancelTarget.id}</b>
              ({cancelTarget.passenger} → {cancelTarget.driver})?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelTarget(null)}>No</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              dispatch(cancelRide(cancelTarget.id)); // ✅ NEW: Dispatch the cancelRide action
              setCancelTarget(null);
            }}
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
