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
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller } from "react-hook-form";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";

const tenderTypeOptions = ["ST", "MT"];
const civilDefenceOptions = ["Civil", "Defence"];
const businessDomainOptions = ["IT", "Electronics", "Telecom", "Construction", "Other"];
const documentTypeOptions = ["RFP", "RFI", "RFE", "EoI", "BQ", "ST", "NIT", "RFQ"];

const leadOwnerOption = [
  "Umesha A",
  "Solomon",
  "Jamuna",
  "Asharani",
  "Chinta",
  "Sravanthy",
  "Praveen",
  "Sandeep",
  "Puneet",
  "Raju",
  "Sivaprasath",
];

const resultStatusOptions = [
  "Won",
  "Lost",
  "Participated",
  "Participated-Won",
  "Participated-Pursuing",
  "Participated-Lost",
  "Not Participated",
];

const openClosedOptions = ["Open", "Closed"];

const presentStatusOptions = [
  "BQ Submitted",
  "Commercial Bid Submitted",
  "EOI was submitted",
  "Not participated",
  " ",
];

const POST_API = "http://localhost:8082/CreateDomesticLead";
const GET_API = "http://localhost:8082/GetDomesticLead";

export default function TenderForm() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [competitorsList, setCompetitorsList] = useState([""]);
  const [tabValue, setTabValue] = useState(0);
  const [domesticData, setDomesticData] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { leadOwner: [] },
  });

  const multilineProps = { multiline: true, rows: 2 };

  const addCompetitorField = () => setCompetitorsList([...competitorsList, ""]);

  const removeCompetitorField = (index) =>
    setCompetitorsList(competitorsList.filter((_, i) => i !== index));

  const updateCompetitorValue = (value, index) => {
    const updated = [...competitorsList];
    updated[index] = value;
    setCompetitorsList(updated);
  };

  const fetchDomesticData = () => {
    axios
      .get(GET_API)
      .then((response) => {
        const data =
          Array.isArray(response.data) && response.data.length
            ? response.data
            : response.data?.data || [];
        setDomesticData(data || []);
      })
      .catch((error) => console.log(error.message));
  };

  useEffect(() => {
    fetchDomesticData();
  }, []);

  const onSubmit = (data) => {
    const competitorsArray = competitorsList
      .filter((v) => v.trim() !== "")
      .map((name, index) => ({ [`${index + 1}`]: name }));

    const payload = {
      ...data,
      competitors: competitorsArray,
      orderWonValue:
        data.orderWonValue && data.orderWonValue !== ""
          ? parseFloat(data.orderWonValue).toFixed(2)
          : null,
      // submittedAt: new Date().toISOString(),
      // OperatorId: "291536",
      // OperatorName: "Vivek Kumar Singh",
      // OperatorRole: "Lead Owner",
      // OperatorSBU: "Software SBU",
    };

    axios
      .post(POST_API, payload)
      .then(() => {
        setSubmittedData(payload);
        setSubmitSuccess(true);
        fetchDomesticData();
      })
      .catch((error) => console.log(error.message));
  };

  const handleReset = () => {
    reset({ leadOwner: [] });
    setCompetitorsList([""]);
    setSubmittedData(null);
  };

  const handleDownloadJSON = () => {
    if (!submittedData) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(submittedData, null, 2)], {
        type: "application/json",
      })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `tender-${Date.now()}.json`;
    a.click();
  };

  const handleCloseSnackbar = () => setSubmitSuccess(false);

  return (
    <Container maxWidth="xl" className="tender-container">
      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab label="Create Domestic Lead" />
        <Tab label="View Domestic Leads" />
      </Tabs>

      {/* TAB 1 — FORM */}
      {tabValue === 0 && (
        <Paper elevation={4} className="tender-paper">
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography variant="h4" className="section-title">
              Domestic Leads Form
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill all details below to submit the tender form
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* SECTION 1 */}
            <Card className="tender-card">
              <CardContent>
                <Typography variant="h6" className="section-title">
                  📌 Domestic Leads Form
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {[
                    ["tenderName", "Tender Name"],
                    ["customer", "Customer"],
                    ["location", "Location"],
                  ].map(([name, label]) => (
                    <Grid item xs={12} key={name}>
                      <Controller
                        name={name}
                        control={control}
                        rules={{ required: `${label} is required` }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label={label}
                            className="text-field-style"
                            {...multilineProps}
                            error={!!errors[name]}
                            helperText={errors[name]?.message}
                          />
                        )}
                      />
                    </Grid>
                  ))}

                  {/* Tender Type */}
                  <Grid item xs={12}>
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
                          {...multilineProps}
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
                </Grid>
              </CardContent>
            </Card>

            {/* SECTION 2 */}
            <Card className="tender-card">
              <CardContent>
                <Typography variant="h6" className="section-title">
                  🏷️ Classification & Financial Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
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
                          {...multilineProps}
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

                  {/* Lead Owner (Multi-select) */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth className="text-field-style">
                      <InputLabel>Lead Owner</InputLabel>
                      <Controller
                        name="leadOwner"
                        control={control}
                        rules={{ required: "Lead Owner is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            multiple
                            input={<OutlinedInput label="Lead Owner" />}
                            renderValue={(selected) => selected.join(", ")}
                          >
                            {leadOwnerOption.map((name) => (
                              <MenuItem key={name} value={name}>
                                <Checkbox checked={field.value.includes(name)} />
                                <ListItemText primary={name} />
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.leadOwner && (
                        <Typography variant="caption" color="error">
                          Lead Owner is required
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Civil / Defence */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="civilDefence"
                      control={control}
                      rules={{ required: "Civil / Defence selection is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Civil / Defence"
                          className="text-field-style"
                          {...multilineProps}
                          error={!!errors.civilDefence}
                          helperText={errors.civilDefence?.message}
                        >
                          {civilDefenceOptions.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* Business Domain */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="businessDomain"
                      control={control}
                      rules={{ required: "Business Domain is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Business Domain"
                          className="text-field-style"
                          {...multilineProps}
                          error={!!errors.businessDomain}
                          helperText={errors.businessDomain?.message}
                        >
                          {businessDomainOptions.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* SECTION 3 */}
            <Card className="tender-card">
              <CardContent>
                <Typography variant="h6" className="section-title">
                  🗓️ Submission Timeline
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {[
                    ["tenderDated", "Tender Dated"],
                    ["lastDateSubmission", "Last Date of Submission"],
                  ].map(([name, label]) => (
                    <Grid item xs={12} md={6} key={name}>
                      <Controller
                        name={name}
                        control={control}
                        rules={{ required: `${label} is required` }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="date"
                            fullWidth
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

                  {/* Sole / Consortium */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="soleConsortium"
                      control={control}
                      rules={{ required: "Sole / Consortium is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Sole / Consortium"
                          className="text-field-style"
                          {...multilineProps}
                          error={!!errors.soleConsortium}
                          helperText={errors.soleConsortium?.message}
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
                          label="Pre-Bid Meeting Date & Time"
                          InputLabelProps={{ shrink: true }}
                          className="text-field-style"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* SECTION 4 */}
            <Card className="tender-card">
              <CardContent>
                <Typography variant="h6" className="section-title">
                  📊 Competitors & Results
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* Competitors dynamic fields */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Competitors
                  </Typography>

                  {competitorsList.map((value, index) => (
                    <Grid container spacing={1} key={index} sx={{ mb: 1 }}>
                      <Grid item xs={11}>
                        <TextField
                          fullWidth
                          label={`Competitor ${index + 1}`}
                          value={value}
                          onChange={(e) => updateCompetitorValue(e.target.value, index)}
                          className="text-field-style"
                        />
                      </Grid>
                      <Grid item xs={1} sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton color="error" onClick={() => removeCompetitorField(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}

                  <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={addCompetitorField}>
                    + Add Competitor
                  </Button>
                </Grid>

                {/* Result-related fields */}
                <Grid container spacing={3} sx={{ mt: 3 }}>
                  {/* Result Status */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="resultStatus"
                      control={control}
                      rules={{ required: "Result Status is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Won / Lost / Participated / Not Participated"
                          className="text-field-style"
                          {...multilineProps}
                          error={!!errors.resultStatus}
                          helperText={errors.resultStatus?.message}
                        >
                          {resultStatusOptions.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* Open / Closed */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="openClosed"
                      control={control}
                      rules={{ required: "Open / Closed is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Open / Closed"
                          className="text-field-style"
                          {...multilineProps}
                          error={!!errors.openClosed}
                          helperText={errors.openClosed?.message}
                        >
                          {openClosedOptions.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* Order Won */}
                  <Grid item xs={12} md={10}>
                    <Controller
                      name="orderWonValue"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="number"
                          label="Order Won Value in Crore (without GST)"
                          className="text-field-style"
                          sx={{ width: "100%" }}
                          {...multilineProps}
                        />
                      )}
                    />
                  </Grid>

                  {/* Present Status */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="presentStatus"
                      control={control}
                      rules={{ required: "Present Status is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Present Status"
                          className="text-field-style"
                          {...multilineProps}
                          error={!!errors.presentStatus}
                          helperText={errors.presentStatus?.message}
                        >
                          {presentStatusOptions.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </TextField>
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

          {/* Snackbar */}
          <Snackbar open={submitSuccess} autoHideDuration={4500} onClose={handleCloseSnackbar}>
            <Alert severity="success" onClose={handleCloseSnackbar}>
              Tender submitted successfully!
            </Alert>
          </Snackbar>

          {/* JSON OUTPUT */}
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
                  maxHeight: 500,
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

      {/* TAB 2 — VIEW DOMESTIC LEADS */}
      {tabValue === 1 && <ViewDomesticLeadData viewData={domesticData} />}
    </Container>
  );
}

function ViewDomesticLeadData({ viewData }) {
  const rows = Array.isArray(viewData) ? viewData : viewData?.data || [];

  const formatCompetitors = (competitors) => {
    if (!competitors) return "";
    if (Array.isArray(competitors)) {
      const names = competitors
        .map((obj) => Object.values(obj || {})[0])
        .filter(Boolean);
      return names.join(", ");
    }
    return String(competitors);
  };

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
        Domestic Leads List
      </Typography>

      <TableContainer component={Paper}>
        <Table aria-label="domestic-leads-table">
          <TableHead>
            <TableRow>
              <TableCell>Tender Name</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Tender Type</TableCell>
              <TableCell>Document Type</TableCell>
              <TableCell>Lead Owner</TableCell>
              <TableCell>Civil / Defence</TableCell>
              <TableCell>Business Domain</TableCell>
              <TableCell>Tender Dated</TableCell>
              <TableCell>Last Date Submission</TableCell>
              <TableCell>Sole / Consortium</TableCell>
              <TableCell>Pre-bid</TableCell>
              <TableCell>Competitors</TableCell>
              <TableCell>Result Status</TableCell>
              <TableCell>Open / Closed</TableCell>
              <TableCell>Order Won Value (Cr)</TableCell>
              <TableCell>Present Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows && rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow key={row.id || index}>
                  <TableCell>{row.tenderName}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.tenderType}</TableCell>
                  <TableCell>{row.documentType}</TableCell>
                  <TableCell>
                    {Array.isArray(row.leadOwner) ? row.leadOwner.join(", ") : row.leadOwner}
                  </TableCell>
                  <TableCell>{row.civilDefence}</TableCell>
                  <TableCell>{row.businessDomain}</TableCell>
                  <TableCell>{row.tenderDated}</TableCell>
                  <TableCell>{row.lastDateSubmission}</TableCell>
                  <TableCell>{row.soleConsortium}</TableCell>
                  <TableCell>{row.preBidDate}</TableCell>
                  <TableCell>{formatCompetitors(row.competitors)}</TableCell>
                  <TableCell>{row.resultStatus}</TableCell>
                  <TableCell>{row.openClosed}</TableCell>
                  <TableCell>{row.orderWonValue}</TableCell>
                  <TableCell>{row.presentStatus}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={17} align="center">
                  No Domestic Leads Found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
