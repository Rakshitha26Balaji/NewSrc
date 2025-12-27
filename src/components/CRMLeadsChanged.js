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

const API = "http://localhost:8082/getCRMLead"; // POST + GET

export default function CRMLeadsForm() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [crmData, setCRMData] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchCRMData = () => {
    axios
      .get(API)
      .then((response) => {
        const data =
          Array.isArray(response.data) && response.data.length
            ? response.data
            : response.data?.data || [];
        setCRMData(data || []);
      })
      .catch((error) => console.log(error.message));
  };

  useEffect(() => {
    fetchCRMData();
  }, []);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      emdValue:
        data.emdValue !== "" ? parseFloat(data.emdValue).toFixed(2) : null,
      approxTenderValue:
        data.approxTenderValue !== ""
          ? parseFloat(data.approxTenderValue).toFixed(2)
          : null,

      // submittedAt: new Date().toISOString(),
      // OperatorId: "291536",
      // OperatorName: "Vivek Kumar Singh",
      // OperatorRole: "Lead Owner",
      // OperatorSBU: "Software SBU",
    };

    axios
      .post(API, payload)
      .then((res) => {
        setSubmittedData(payload);
        setSubmitSuccess(true);
        fetchCRMData();
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
      new Blob([JSON.stringify(submittedData, null, 2)], {
        type: "application/json",
      })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `crmlead-${submittedData?.leadId || "crm"}-${Date.now()}.json`;
    a.click();
  };

  return (
    <Container maxWidth="xl" className="tender-container">
      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
        <Tab label="Create CRM Lead" />
        <Tab label="View CRM Leads" />
      </Tabs>

      {/* ---------------- TAB 1 — FORM ---------------- */}
      {tabValue === 0 && (
        <Paper elevation={4} className="tender-paper">
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography variant="h4" className="section-title">
              CRM Leads Form
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill all details below to submit the CRM lead form
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="tender-card">
              <CardContent>
                <Typography variant="h6" className="section-title">
                  📌 CRM Lead Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {[
                    ["leadId", "Lead ID"],
                    ["issueDate", "Issue Date", "date"],
                    ["tenderName", "Tender Name"],
                    ["organisation", "Organisation"],
                  ].map(([name, label, type]) => (
                    <Grid item xs={12} md={6} key={name}>
                      <Controller
                        name={name}
                        control={control}
                        rules={{ required: `${label} is required` }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type={type || "text"}
                            label={label}
                            InputLabelProps={{ shrink: true }}
                            className="text-field-style"
                            error={!!errors[name]}
                            helperText={errors[name]?.message}
                          />
                        )}
                      />
                    </Grid>
                  ))}

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
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                          error={!!errors.documentType}
                          helperText={errors.documentType?.message}
                        >
                          {documentTypeOptions.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </TextField>
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
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                          error={!!errors.tenderType}
                          helperText={errors.tenderType?.message}
                        >
                          {tenderTypeOptions.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* EMD Value */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="emdValue"
                      control={control}
                      rules={{ required: "EMD value is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="number"
                          label="EMD in Crore"
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                          error={!!errors.emdValue}
                          helperText={errors.emdValue?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Approx Tender Value */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="approxTenderValue"
                      control={control}
                      rules={{ required: "Approx Tender Value is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="number"
                          label="Approx Tender Value in Crore"
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                          error={!!errors.approxTenderValue}
                          helperText={errors.approxTenderValue?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Last Date of Submission */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="lastDateSubmission"
                      control={control}
                      rules={{ required: "Last Date of Submission is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          label="Last Date of Submission"
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                          error={!!errors.lastDateSubmission}
                          helperText={errors.lastDateSubmission?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Pre Bid Date */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="preBidDate"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="datetime-local"
                          fullWidth
                          label="Pre-bid Date & Time"
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                        />
                      )}
                    />
                  </Grid>

                  {/* Team Assigned */}
                  <Grid item xs={12}>
                    <Controller
                      name="teamAssigned"
                      control={control}
                      rules={{ required: "Team Assigned is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Team Assigned"
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                          error={!!errors.teamAssigned}
                          helperText={errors.teamAssigned?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Remarks */}
                  <Grid item xs={12}>
                    <Controller
                      name="remarks"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={2}
                          label="Remarks"
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                        />
                      )}
                    />
                  </Grid>

                  {/* Corrigendum */}
                  <Grid item xs={12}>
                    <Controller
                      name="corrigendum"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Corrigendums – Date & File"
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* BUTTONS */}
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
              CRM Lead submitted successfully!
            </Alert>
          </Snackbar>

          {/* JSON PREVIEW */}
          {submittedData && (
            <Box sx={{ mt: 6 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6">📌 Submitted Data (JSON)</Typography>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={handleDownloadJSON}
                >
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
                  maxHeight: 450,
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

      {/* ---------------- TAB 2 — VIEW CRM DATA ---------------- */}
      {tabValue === 1 && <ViewCRMData viewData={crmData} />}
    </Container>
  );
}

function ViewCRMData({ viewData }) {
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
        CRM Leads List
      </Typography>

      <TableContainer component={Paper}>
        <Table aria-label="crm-table">
          <TableHead>
            <TableRow>
              <TableCell>Lead ID</TableCell>
              <TableCell>Issue Date</TableCell>
              <TableCell>Tender Name</TableCell>
              <TableCell>Organisation</TableCell>
              <TableCell>Document Type</TableCell>
              <TableCell>Tender Type</TableCell>
              <TableCell>EMD (Cr)</TableCell>
              <TableCell>Approx Value (Cr)</TableCell>
              <TableCell>Last Date</TableCell>
              <TableCell>Pre-bid</TableCell>
              <TableCell>Team Assigned</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Corrigendum</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.leadId}</TableCell>
                  <TableCell>{row.issueDate}</TableCell>
                  <TableCell>{row.tenderName}</TableCell>
                  <TableCell>{row.organisation}</TableCell>
                  <TableCell>{row.documentType}</TableCell>
                  <TableCell>{row.tenderType}</TableCell>
                  <TableCell>{row.emdValue}</TableCell>
                  <TableCell>{row.approxTenderValue}</TableCell>
                  <TableCell>{row.lastDateSubmission}</TableCell>
                  <TableCell>{row.preBidDate}</TableCell>
                  <TableCell>{row.teamAssigned}</TableCell>
                  <TableCell>{row.remarks}</TableCell>
                  <TableCell>{row.corrigendum}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={13} align="center">
                  No CRM Leads Found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
