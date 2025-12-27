import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

export default function CRMLeadsForm({ OrderData }) {
  const [value, setValue] = useState(0);
  const [submittedData, setSubmittedData] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const documentTypeOptions = ["EoI", "RFP", "Tender", "Corrigendum"];
  const tenderTypeOptions = ["Open", "Limited", "Single Bid"];

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  /** ⭐ Shared TextField Styling */
  const commonFieldSx = {
    minWidth: "260px",
    "& .MuiInputBase-root": {
      height: 58,
      fontSize: "1.06rem",
      backgroundColor: "rgba(255,255,255,0.78)",
      borderRadius: "12px",
      backdropFilter: "blur(6px)",
      paddingLeft: "12px",
    },
    "& .MuiInputLabel-root": {
      fontSize: "1.05rem",
      fontWeight: 600,
      transition: "all 0.22s ease",
      marginLeft: "4px",
    },
    "& .MuiInputLabel-shrink": {
      transform: "translate(10px, -10px) scale(0.85)",
      background: "white",
      padding: "0 6px",
      borderRadius: "6px",
    },
  };

  const selectFieldSx = {
    ...commonFieldSx,
    "& .MuiSelect-select": { padding: "16px" },
  };

  const onSubmit = (data) => {
    console.log("CRM Lead Data:", data);
    setSubmittedData(data);
    setSubmitSuccess(true);
  };

  const handleReset = () => {
    reset();
    setSubmittedData(null);
  };

  const handleCloseSnackbar = () => setSubmitSuccess(false);

  const handleDownloadJSON = () => {
    if (!submittedData) return;
    const blob = new Blob([JSON.stringify(submittedData, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "CRM_Lead_Data.json";
    link.click();
  };

  return (
    <Container maxWidth="xl" sx={{ p: 0 }}>
      <Box sx={{ mt: { xs: 7, sm: 7 }, ml: { xs: 0, sm: 8, md: 10, lg: 12 }, mr: 2 }}>
        {/* Tabs */}
        <Tabs
          value={value}
          onChange={(e, v) => setValue(v)}
          centered
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#0d47a1",
              textTransform: "none",
            },
            "& .Mui-selected": { color: "#1565c0" },
            mb: 3,
          }}
        >
          <Tab label="Create Data" />
          <Tab label="View Data" />
        </Tabs>

        {/* CREATE TAB */}
        {value === 0 && (
          <Paper
            elevation={6}
            sx={{
              p: { xs: 2, sm: 3 },
              background: "rgba(255,255,255,0.85)",
              borderRadius: 4,
              backdropFilter: "blur(10px)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.16)",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#0A3D91" }}>
                CRM Leads Form
              </Typography>
              <Typography variant="body1" sx={{ color: "#37474F" }}>
                Kindly fill all required fields to create a CRM lead record
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Card
                sx={{
                  mb: 3,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#0A3D91" }}>
                    📌 CRM Lead Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    {[
                      ["leadID", "Lead ID"],
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
                              type={type || "text"}
                              fullWidth
                              label={label}
                              error={!!errors[name]}
                              helperText={errors[name]?.message}
                              sx={commonFieldSx}
                              InputLabelProps={{ shrink: true }}
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
                            error={!!errors.documentType}
                            helperText={errors.documentType?.message}
                            sx={selectFieldSx}
                            InputLabelProps={{ shrink: true }}
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
                            error={!!errors.tenderType}
                            helperText={errors.tenderType?.message}
                            sx={selectFieldSx}
                            InputLabelProps={{ shrink: true }}
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
                        name="emdInCrore"
                        control={control}
                        rules={{ required: "EMD value is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="number"
                            fullWidth
                            label="EMD in Crore"
                            error={!!errors.emdInCrore}
                            helperText={errors.emdInCrore?.message}
                            sx={commonFieldSx}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Approx Tender Value */}
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="approxTenderValueCrore"
                        control={control}
                        rules={{ required: "Approx Tender Value is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="number"
                            fullWidth
                            label="Approx Tender Value in Crore"
                            error={!!errors.approxTenderValueCrore}
                            helperText={errors.approxTenderValueCrore?.message}
                            sx={commonFieldSx}
                            InputLabelProps={{ shrink: true }}
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
                            error={!!errors.lastDateSubmission}
                            helperText={errors.lastDateSubmission?.message}
                            sx={commonFieldSx}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Pre-bid Date */}
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="preBidDate"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="datetime-local"
                            fullWidth
                            label="Pre-Bid Date & Time"
                            sx={commonFieldSx}
                            InputLabelProps={{ shrink: true }}
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
                            error={!!errors.teamAssigned}
                            helperText={errors.teamAssigned?.message}
                            sx={commonFieldSx}
                            InputLabelProps={{ shrink: true }}
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
                            sx={commonFieldSx}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Corrigendum */}
                    <Grid item xs={12}>
                      <Controller
                        name="corrigendumInfo"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Corrigendum Date & File"
                            sx={commonFieldSx}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* BUTTONS */}
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
                <Button
                  type="submit"
                  size="large"
                  sx={{
                    px: 5,
                    py: 1.7,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    borderRadius: 3,
                    background: "linear-gradient(90deg, #1565c0, #4ea5ff)",
                    color: "#fff",
                  }}
                >
                  Submit CRM Lead
                </Button>

                <Button
                  type="button"
                  size="large"
                  onClick={handleReset}
                  sx={{
                    px: 5,
                    py: 1.7,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#1565c0",
                    border: "2px solid #1565c0",
                    borderRadius: 3,
                  }}
                >
                  Reset Form
                </Button>
              </Box>
            </form>

            {/* SUCCESS SNACKBAR */}
            <Snackbar open={submitSuccess} onClose={handleCloseSnackbar} autoHideDuration={6000}>
              <Alert severity="success" sx={{ width: "100%" }}>
                CRM lead submitted successfully!
              </Alert>
            </Snackbar>

            {/* JSON PREVIEW */}
            {submittedData && (
              <Box sx={{ mt: 5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    📊 Submitted Data (JSON)
                  </Typography>
                  <Button variant="contained" color="success" onClick={handleDownloadJSON}>
                    Download JSON
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    backgroundColor: "#1e1e1e",
                    color: "#d4d4d4",
                    fontFamily: "monospace",
                    maxHeight: 500,
                    overflow: "auto",
                    borderRadius: 2,
                  }}
                >
                  <pre style={{ margin: 0 }}>{JSON.stringify(submittedData, null, 2)}</pre>
                </Paper>
              </Box>
            )}
          </Paper>
        )}

        {/* VIEW TAB */}
        {value === 1 && OrderData && (
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              View Data
            </Typography>
            <Typography variant="body1" sx={{ color: "#455A64" }}>
              (Later you can integrate GET API to show CRM Leads data here.)
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
}
// 291536