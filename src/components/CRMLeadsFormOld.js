// --------------------------------------------------------
// CRM Lead Form (Redesigned to match BQ Theme & Styling)
// --------------------------------------------------------

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Snackbar,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

// ----------------------------------------
//  THEME STYLES (Same as Budgetary Quotation Form)
// ----------------------------------------

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    "& fieldset": {
      borderColor: "#c6cfe1",
    },
    "&:hover fieldset": {
      borderColor: "#7ba4ff",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1976d2",
      borderWidth: "2px",
    },
  },
};

const cardStyle = {
  mb: 3,
  backgroundColor: "#f4f7ff",
  border: "1px solid #d8e1f5",
  borderRadius: "16px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  p: 2,
};

const sectionTitleStyle = {
  fontWeight: 600,
  mb: 1,
  color: "#1a4fbf",
  letterSpacing: "0.3px",
};

// ----------------------------------------


const tenderTypeOptions = ["ST", "MT", "Nom", "LT"];
const documentTypeOptions = ["RFP", "RFQ", "EOI", "BQ", "NIT", "RFI", "Others"];

const CRMLeadForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [value, setValue] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [ServerIp, SetServerIp] = useState("");

  const API = "/getCRMLeads";
  let user = JSON.parse(localStorage.getItem("user"));

  // ----------------------------------------------------
  // LOAD SERVER IP + EXISTING DATA
  // ----------------------------------------------------
  useEffect(() => {
    axios
      .get(`/config.json`)
      .then((response) => {
        const ip = response.data.project[0].ServerIP[0].NodeServerIP + API;
        SetServerIp(ip);

        axios.get(ip).then((res) => setOrderData(res.data));
      })
      .catch(() => {
        SetServerIp("172.195.120.135");
      });
  }, []);

  // ----------------------------------------------------
  //  FORM HOOK SETUP
  // ----------------------------------------------------
  const {
    control,
    handleSubmit,
      watch, 
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      leadID: "",
      issueDate: "",
      tenderName: "",
      organisation: "",
      documentType: "",
      tenderType: "",
      emdInCrore: "",
      approxTenderValueCrore: "",
      lastDateSubmission: "",
      preBidDate: "",
      teamAssigned: "",
      remarks: "",
      corrigendumInfo: "",
    },
  });


  
const today = new Date().toLocaleDateString("en-CA");
const now = new Date().toLocaleString("sv-SE").slice(0, 16);
const lastDateSubmission = watch("lastDateSubmission");

  // ----------------------------------------------------
  //  SUBMIT HANDLER
  // ----------------------------------------------------
  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      emdInCrore: data.emdInCrore !== "" ? parseFloat(data.emdInCrore) : null,
      approxTenderValueCrore:
        data.approxTenderValueCrore !== ""
          ? parseFloat(data.approxTenderValueCrore)
          : null,
      submittedAt: new Date().toISOString(),

      OperatorId: user.id || "291536",
      OperatorName: user.username || "Vivek Kumar Singh",
      OperatorRole: user.userRole || "Lead Owner",
      OperatorSBU: "Software SBU",
    };

    axios
      .post(ServerIp, formattedData)
      .then(() => {
        setSubmittedData(formattedData);
        setSubmitSuccess(true);
      })
      .catch((error) => console.log(error.message));
  };

  const handleReset = () => {
    reset();
    setSubmittedData(null);
  };

  // ----------------------------------------------------
  //  UI START
  // ----------------------------------------------------

  return (
    <Container
      maxWidth="xl"
      sx={{
        pb: 4,
        mb: 6,
        background: "linear-gradient(to bottom right, #e9f1ff, #ffffff)",
        borderRadius: 4,
        mt: 2,
        p: 3,
      }}
    >
      <Tabs value={value} onChange={(e, v) => setValue(v)}>
        <Tab label="Create Data" sx={{ fontWeight: 700 }} />
        <Tab label="View Data" sx={{ fontWeight: 700 }} />
      </Tabs>

      {/* ----------------------------------------------------
            CREATE DATA FORM
      ---------------------------------------------------- */}
      {value === 0 && (
        <Paper sx={{ p: { xs: 2, sm: 4 }, backgroundColor: "#ffffff", mt: 2 }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              color: "#1a4fbf",
              mb: 1,
            }}
          >
            CRM Leads Form
          </Typography>

          <Box
            sx={{
              height: "3px",
              width: "100%",
              backgroundColor: "#1a4fbf",
              mb: 4,
            }}
          />

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* SECTION 1 */}
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" sx={sectionTitleStyle}>
                  CRM Lead Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={4}>
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
                            label={label}
                            fullWidth
                            type={type || "text"}
                            InputLabelProps={{ shrink: true }}
                            error={!!errors[name]}
                            helperText={errors[name]?.message}
                            sx={textFieldStyle}
                            inputProps={
                              type === "date"
                                ? { max: today } // ✅ disables future dates ONLY for Issue Date
                                : undefined
                            }
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
                          sx={textFieldStyle}
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
                          sx={textFieldStyle}
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

                  {/* EMD */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="emdInCrore"
                      control={control}
                      rules={{ required: "EMD value is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="number"
                          label="EMD in Crore"
                          InputLabelProps={{ shrink: true }}
                          sx={textFieldStyle}
                          error={!!errors.emdInCrore}
                          helperText={errors.emdInCrore?.message}
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
                          fullWidth
                          type="number"
                          label="Approx Tender Value (Cr)"
                          InputLabelProps={{ shrink: true }}
                          sx={textFieldStyle}
                          error={!!errors.approxTenderValueCrore}
                          helperText={errors.approxTenderValueCrore?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Last Date */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="lastDateSubmission"
                      control={control}
                      rules={{
                        required: "Last Date of Submission is required",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="date"
                          label="Last Date of Submission"
                          InputLabelProps={{ shrink: true }}
                          sx={textFieldStyle}
                          error={!!errors.lastDateSubmission}
                          helperText={errors.lastDateSubmission?.message}
                          inputProps={{
                            min: today, // ✅ past dates disabled
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Pre-bid Date */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="preBidDate"
                      control={control}
                      rules={{
                        validate: (value) =>
                          !lastDateSubmission ||
                          value <= `${lastDateSubmission}T23:59`
                            ? true
                            : "Pre-bid date must be on or before Last Date of Submission",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="datetime-local"
                          label="Pre-bid Date & Time"
                          InputLabelProps={{ shrink: true }}
                          sx={textFieldStyle}
                          inputProps={{
                            min: now, // ✅ past date-time disabled
                            max: lastDateSubmission
                              ? `${lastDateSubmission}T23:59`
                              : undefined,
                          }}
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
                          sx={textFieldStyle}
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
                          label="Remarks"
                          multiline
                          rows={2}
                          InputLabelProps={{ shrink: true }}
                          sx={textFieldStyle}
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
                          InputLabelProps={{ shrink: true }}
                          sx={textFieldStyle}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* BUTTONS */}
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ px: 5 }}
              >
                Submit
              </Button>
              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={handleReset}
                sx={{ px: 5, ml: 3 }}
              >
                Reset
              </Button>
            </Box>
          </form>

          {/* SUCCESS ALERT */}
          <Snackbar
            open={submitSuccess}
            autoHideDuration={5000}
            onClose={() => setSubmitSuccess(false)}
          >
            <Alert severity="success">CRM Lead submitted successfully!</Alert>
          </Snackbar>

          {/* JSON OUTPUT */}
          {submittedData && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Submitted JSON Data
              </Typography>

              <Paper
                sx={{
                  p: 3,
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  borderRadius: 2,
                  fontFamily: "monospace",
                }}
              >
                <pre>{JSON.stringify(submittedData, null, 2)}</pre>
              </Paper>
            </Box>
          )}
        </Paper>
      )}

      {/* ----------------------------------------------------
            VIEW DATA TABLE
      ---------------------------------------------------- */}
      {value === 1 && orderData && <ViewCRMLeadData ViewData={orderData} />}
    </Container>
  );
};

// ----------------------------------------------------
// VIEW TABLE COMPONENT
// ----------------------------------------------------

function ViewCRMLeadData({ ViewData }) {
  return (
    <>
      <Typography
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          backgroundColor: "lavender",
          p: 1,
          fontSize: "1.4rem",
          mt: 3,
        }}
      >
        CRM Lead Records
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Lead ID",
                "Issue Date",
                "Tender Name",
                "Organisation",
                "Document Type",
                "Tender Type",
                "EMD (Cr)",
                "Approx Value (Cr)",
                "Last Date Submission",
                "Pre-bid Date",
                "Team Assigned",
                "Remarks",
                "Corrigendum Info",
              ].map((head) => (
                <TableCell
                  key={head}
                  sx={{ fontWeight: 700, fontSize: "15px" }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {ViewData.data?.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.leadID}</TableCell>
                <TableCell>{row.issueDate}</TableCell>
                <TableCell>{row.tenderName}</TableCell>
                <TableCell>{row.organisation}</TableCell>
                <TableCell>{row.documentType}</TableCell>
                <TableCell>{row.tenderType}</TableCell>
                <TableCell>{row.emdInCrore}</TableCell>
                <TableCell>{row.approxTenderValueCrore}</TableCell>
                <TableCell>{row.lastDateSubmission}</TableCell>
                <TableCell>{row.preBidDate}</TableCell>
                <TableCell>{row.teamAssigned}</TableCell>
                <TableCell>{row.remarks}</TableCell>
                <TableCell>{row.corrigendumInfo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default CRMLeadForm;
