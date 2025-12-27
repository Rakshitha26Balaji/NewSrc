// BEAUTIFULLY REGENERATED BLUE THEME + FULL-WIDTH RESPONSIVE VERSION

import { useEffect, useState } from "react";
import {
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
  TableBody,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Container,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";

// Blue theme reference colors
const themeBlue = {
  primary: "#1565c0",
  headerBg: "#0d47a1",
  sectionBg: "#f0f6ff",
  tableStriped: "#f4f9ff",
  tableHover: "#e3f2fd",
};

const BudgetaryQuotationForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [value, setValue] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [ServerIp, SetServerIp] = useState("");

  const API = "/getBudgetaryQuoatation";
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch config + API data
  useEffect(() => {
    axios
      .get(`/config.json`)
      .then((response) => {
        const server = response.data.project[0].ServerIP[0].NodeServerIP + API;
        SetServerIp(server);
        axios.get(server).then((res) => setOrderData(res.data));
      })
      .catch(() => SetServerIp("172.195.120.135"));
  }, []);

  // Form defaults
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      bqTitle: "",
      customerName: "",
      customerAddress: "",
      leadOwner: "",
      defenceAndNonDefence: "",
      estimateValueInCrWithoutGST: "",
      submittedValueInCrWithoutGST: "",
      dateOfLetterSubmission: "",
      referenceNo: "",
      JSON_competitors: "",
      presentStatus: "",
    },
  });

  const defenceOptions = ["Defence", "Non-Defence", "Civil"];
  const statusOptions = [
    "Budgetary Quotation Submitted",
    "Commercial Bid Submitted",
    "EoI was Submitted",
    "Not Participated",
  ];

  // Submit handler
  const onSubmit = (data) => {
    const formatted = {
      ...data,
      estimateValueInCrWithoutGST: parseFloat(data.estimateValueInCrWithoutGST),
      submittedValueInCrWithoutGST: parseFloat(data.submittedValueInCrWithoutGST),
      submittedAt: new Date().toISOString(),
      OperatorId: user.id,
      OperatorName: user.username,
      OperatorRole: user.userRole,
      OperatorSBU: "Software SBU",
    };

    axios.post(ServerIp, formatted).then(() => {
      setSubmittedData(formatted);
      setSubmitSuccess(true);
    });
  };

  return (
    <Container maxWidth="xl" sx={{ pb: 4 }}>
      {/* TABS */}
      <Tabs
        value={value}
        onChange={(e, v) => setValue(v)}
        indicatorColor="primary"
        textColor="primary"
        sx={{
          mb: 3,
          "& .MuiTab-root": { fontWeight: 700, fontSize: "1.1rem" },
        }}
      >
        <Tab label="Create Data" />
        <Tab label="View Data" />
      </Tabs>

      {/* ------------------- FORM SECTION ------------------- */}
      {value === 0 && (
        <Paper
          elevation={5}
          sx={{
            p: 4,
            borderRadius: 3,
            width: "100%",
            maxWidth: "1500px",
            mx: "auto",
            background: "#ffffff",
          }}
        >
          {/* Title */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: themeBlue.primary }}>
              Budgetary Quotation Form
            </Typography>
            <Divider sx={{ mt: 2, borderColor: themeBlue.primary }} />
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ================= BQ DETAILS ================= */}
            <Card sx={{ mb: 3, borderRadius: 3, backgroundColor: themeBlue.sectionBg }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: themeBlue.primary }}>
                  📘 BQ Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {["bqTitle", "customerName", "customerAddress", "leadOwner"].map((name, index) => (
                    <Grid key={index} item xs={12} sm={6}>
                      <Controller
                        name={name}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={name.replace(/([A-Z])/g, " $1")}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* ================= CLASSIFICATION ================= */}
            <Card sx={{ mb: 3, borderRadius: 3, backgroundColor: themeBlue.sectionBg }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: themeBlue.primary }}>
                  🏷 Classification & Financial Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="defenceAndNonDefence"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Defence / Non-Defence"
                          sx={{ width: 260 }}
                          InputLabelProps={{ shrink: true }}
                        >
                          {defenceOptions.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                              {opt}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="estimateValueInCrWithoutGST"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} label="Estimate Value Without GST" fullWidth InputLabelProps={{ shrink: true }} />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="submittedValueInCrWithoutGST"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} label="Submitted Value Without GST" fullWidth InputLabelProps={{ shrink: true }} />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* ================= ADDITIONAL INFO ================= */}
            <Card sx={{ mb: 3, borderRadius: 3, backgroundColor: themeBlue.sectionBg }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: themeBlue.primary }}>
                  📝 Additional Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="referenceNo"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} label="Reference Number" fullWidth InputLabelProps={{ shrink: true }} />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="dateOfLetterSubmission"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} label="Date Of Submission" type="date" fullWidth InputLabelProps={{ shrink: true }} />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="presentStatus"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} select label="Present Status" sx={{ width: 260 }}>
                          {statusOptions.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                              {opt}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="JSON_competitors"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Competitors"
                          fullWidth
                          multiline
                          sx={{ minWidth: 500 }}
                          rows={2}
                          placeholder="Company A, Company B..."
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Buttons */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 3 }}>
              <Button variant="contained" sx={{ px: 4, py: 1 }}>
                Submit
              </Button>
              <Button variant="outlined" sx={{ px: 4, py: 1 }} onClick={() => reset()}>
                Reset
              </Button>
            </Box>
          </form>

          {/* Success Snackbar */}
          <Snackbar open={submitSuccess} autoHideDuration={3000}>
            <Alert severity="success">Form submitted successfully!</Alert>
          </Snackbar>

          {/* Submitted JSON Preview */}
          {submittedData && (
            <Paper sx={{ p: 2, mt: 4, background: "#0d1b2a", color: "#fff", borderRadius: 2 }}>
              <Typography variant="h6">📊 Submitted Data Preview</Typography>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            </Paper>
          )}
        </Paper>
      )}

      {/* ------------------- TABLE SECTION ------------------- */}
      {value === 1 && <ViewBudgetaryQuotationData ViewData={orderData} />}
    </Container>
  );
};

/* ------------------ VIEW TABLE COMPONENT ------------------ */

function ViewBudgetaryQuotationData({ ViewData }) {
  return (
    <Paper elevation={5} sx={{ p: 4, borderRadius: 3 }}>
      <Typography
        sx={{
          fontWeight: 800,
          color: themeBlue.primary,
          textAlign: "center",
          fontSize: "2rem",
          mb: 3,
        }}
      >
        📑 Budgetary Quotation Records
      </Typography>

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          borderRadius: 2,
          width: "100%",
          maxWidth: "1800px",
          mx: "auto",
          overflowX: "auto", // 👈 horizontal scroll enabled
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                "BQ Title",
                "Customer",
                "Address",
                "Lead Owner",
                "Category",
                "Est. Value",
                "Submitted Value",
                "Date",
                "Ref No",
                "Competitors",
                "Status",
              ].map((col) => (
                <TableCell
                  key={col}
                  sx={{
                    backgroundColor: themeBlue.headerBg,
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {ViewData?.data?.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? themeBlue.tableStriped : "white",
                  "&:hover": { backgroundColor: themeBlue.tableHover },
                }}
              >
                <TableCell>{row.bqTitle}</TableCell>
                <TableCell>{row.customerName}</TableCell>
                <TableCell>{row.customerAddress}</TableCell>
                <TableCell>{row.leadOwner}</TableCell>
                <TableCell>{row.defenceAndNonDefence}</TableCell>
                <TableCell>{row.estimateValueInCrWithoutGST}</TableCell>
                <TableCell>{row.submittedValueInCrWithoutGST}</TableCell>
                <TableCell>{row.dateOfLetterSubmission}</TableCell>
                <TableCell>{row.referenceNo}</TableCell>
                <TableCell>{row.JSON_competitors}</TableCell>
                <TableCell>{row.presentStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default BudgetaryQuotationForm;
