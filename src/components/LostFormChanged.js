import React, { useState, useEffect } from "react";
import "./TenderForm.css";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  Divider,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";

const tenderTypeOptions = ["Open Tender", "Limited Tender", "Global Tender"];
const documentTypeOptions = ["PDF", "DOC", "XLS", "Others"];

// Single URL for POST & GET
const API = "http://localhost:8082/getLost";

export default function LostForm() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [lostData, setLostData] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchLostRecords = () => {
    axios
      .get(API)
      .then((response) => {
        const data =
          Array.isArray(response.data) && response.data.length
            ? response.data
            : response.data?.data || [];
        setLostData(data || []);
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    fetchLostRecords();
  }, []);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      valueWithoutGST:
        data.valueWithoutGST ? parseFloat(data.valueWithoutGST).toFixed(2) : null,
      valueWithGST:
        data.valueWithGST ? parseFloat(data.valueWithGST).toFixed(2) : null,

      // submittedAt: new Date().toISOString(),
      // OperatorId: "291536",
      // OperatorName: "Vivek Kumar Singh",
      // OperatorRole: "Lead Owner",
      // OperatorSBU: "Software SBU",
    };

    axios
      .post(API, payload)
      .then(() => {
        setSubmittedData(payload);
        setSubmitSuccess(true);
        fetchLostRecords();
      })
      .catch((err) => console.log(err.message));
  };

  const handleReset = () => {
    reset();
    setSubmittedData(null);
  };

  const handleCloseSnackbar = () => setSubmitSuccess(false);

  const handleDownloadJSON = () => {
    if (!submittedData) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(submittedData, null, 2)], { type: "application/json" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `lost-${submittedData?.tenderName || "lost"}-${Date.now()}.json`;
    a.click();
  };

  return (
    <Container maxWidth="xl" className="tender-container">
      <Tabs sx={{ mb: 3 }} value={tabValue} onChange={(e, v) => setTabValue(v)}>
        <Tab label="Create Lost Lead" />
        <Tab label="View Lost Leads" />
      </Tabs>

      {/* ============= TAB 1 — FORM ============= */}
      {tabValue === 0 && (
        <Paper elevation={4} className="tender-paper">
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography variant="h4" className="section-title">
              Lost Form
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill all details below to update the LOST tender information
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="tender-card">
              <CardContent>
                <Typography variant="h6" className="section-title">
                  📌 Lost Tender Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {/* Sl No */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="slno"
                      control={control}
                      rules={{ required: "Sl.No is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          fullWidth
                          label="Sl.No"
                          className="text-field-style"
                          error={!!errors.slno}
                          helperText={errors.slno?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Tender Name */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="tenderName"
                      control={control}
                      rules={{ required: "Tender Name / Lead Description is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Tender Name / Lead Description"
                          className="text-field-style"
                          error={!!errors.tenderName}
                          helperText={errors.tenderName?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Customer */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="customer"
                      control={control}
                      rules={{ required: "Customer is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Customer"
                          className="text-field-style"
                          error={!!errors.customer}
                          helperText={errors.customer?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Tender Type */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="tenderType"
                      control={control}
                      rules={{ required: "Tender Type is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Tender Type"
                          className="text-field-style"
                          error={!!errors.tenderType}
                          helperText={errors.tenderType?.message}
                        >
                          {tenderTypeOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* Document Type */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="documentType"
                      control={control}
                      rules={{ required: "Document Type is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Document Type"
                          className="text-field-style"
                          error={!!errors.documentType}
                          helperText={errors.documentType?.message}
                        >
                          {documentTypeOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* Value Without GST */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="valueWithoutGST"
                      control={control}
                      rules={{ required: "Value without GST is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          fullWidth
                          label="Value in Crore (without GST)"
                          className="text-field-style"
                          error={!!errors.valueWithoutGST}
                          helperText={errors.valueWithoutGST?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Value With GST */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="valueWithGST"
                      control={control}
                      rules={{ required: "Value with GST is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          fullWidth
                          label="Value in Crore (with GST)"
                          className="text-field-style"
                          error={!!errors.valueWithGST}
                          helperText={errors.valueWithGST?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Reason for Losing */}
                  <Grid item xs={12}>
                    <Controller
                      name="reasonForLosing"
                      control={control}
                      rules={{ required: "Reason for losing is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={2}
                          label="Reason for Losing"
                          className="text-field-style"
                          error={!!errors.reasonForLosing}
                          helperText={errors.reasonForLosing?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Year Lost */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="yearLost"
                      control={control}
                      rules={{ required: "Year we lost is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          fullWidth
                          label="Year We Lost"
                          className="text-field-style"
                          error={!!errors.yearLost}
                          helperText={errors.yearLost?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Partners */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="partners"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Partners"
                          className="text-field-style"
                        />
                      )}
                    />
                  </Grid>

                  {/* Competitors */}
                  <Grid item xs={12}>
                    <Controller
                      name="competitors"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={2}
                          label="Competitors"
                          className="text-field-style"
                        />
                      )}
                    />
                  </Grid>

                  {/* Technical Score */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="technicalScore"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          fullWidth
                          label="Technical Score"
                          className="text-field-style"
                        />
                      )}
                    />
                  </Grid>

                  {/* Quoted Price */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="quotedPrice"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          fullWidth
                          label="Quoted Price"
                          className="text-field-style"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* SUBMIT + RESET BUTTONS */}
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <Button type="submit" variant="contained" size="large" className="btn-submit">
                Submit
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button
                type="button"
                variant="outlined"
                size="large"
                className="btn-reset"
                onClick={handleReset}
              >
                Reset
              </Button>
            </Box>
          </form>

          {/* SUCCESS SNACKBAR */}
          <Snackbar open={submitSuccess} autoHideDuration={4500} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
              LOST tender details submitted successfully!
            </Alert>
          </Snackbar>

          {/* JSON OUTPUT */}
          {submittedData && (
            <Box sx={{ mt: 6 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6">📌 Submitted Data (JSON)</Typography>
                <Button variant="contained" color="success" size="small" onClick={handleDownloadJSON}>
                  Download JSON
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  maxHeight: 480,
                  overflow: "auto",
                  borderRadius: 2,
                }}
              >
                <pre>{JSON.stringify(submittedData, null, 2)}</pre>
              </Paper>
            </Box>
          )}
        </Paper>
      )}

      {/* ============= TAB 2 — LOST TABLE LIST ============= */}
      {tabValue === 1 && <ViewLostData viewData={lostData} />}
    </Container>
  );
}

function ViewLostData({ viewData }) {
  const rows = Array.isArray(viewData) ? viewData : viewData?.data || [];

  return (
    <>
      <Typography
        sx={{
          textAlign: "center",
          fontSize: "1.4rem",
          fontWeight: "bold",
          backgroundColor: "lavender",
          mb: 2,
          p: 1,
        }}
      >
        Lost Tenders List
      </Typography>

      <TableContainer component={Paper}>
        <Table aria-label="lost-table">
          <TableHead>
            <TableRow>
              <TableCell>Sl.No</TableCell>
              <TableCell>Tender Name</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Tender Type</TableCell>
              <TableCell>Document Type</TableCell>
              <TableCell>Value Without GST</TableCell>
              <TableCell>Value With GST</TableCell>
              <TableCell>Reason for Losing</TableCell>
              <TableCell>Year Lost</TableCell>
              <TableCell>Partners</TableCell>
              <TableCell>Competitors</TableCell>
              <TableCell>Technical Score</TableCell>
              <TableCell>Quoted Price</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.slno}</TableCell>
                  <TableCell>{row.tenderName}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell>{row.tenderType}</TableCell>
                  <TableCell>{row.documentType}</TableCell>
                  <TableCell>{row.valueWithoutGST}</TableCell>
                  <TableCell>{row.valueWithGST}</TableCell>
                  <TableCell>{row.reasonForLosing}</TableCell>
                  <TableCell>{row.yearLost}</TableCell>
                  <TableCell>{row.partners}</TableCell>
                  <TableCell>{row.competitors}</TableCell>
                  <TableCell>{row.technicalScore}</TableCell>
                  <TableCell>{row.quotedPrice}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={13} align="center">
                  No Lost Tender Records Found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
