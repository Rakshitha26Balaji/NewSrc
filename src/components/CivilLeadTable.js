import React, { useState } from "react";
import "../Table.css";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";

export default function LeadTable() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [formData, setFormData] = useState({
    slno: "",
    title: "",
    customer: "",
    idst: "",
    date: "",
    type: "",
    value: "",
    status: "",
    owner: "",
  });

  const tenderOptions = ["BQ", "ST", "EOI"];
  const idstOptions = ["IDST", "IUST"];
  const statusOptions = ["BQ Submitted",
  "Commercial Bid Submitted",
  "EOI was submitted",
  "Not participated",
  " ",];

  const handleOpen = (index = null) => {
    setEditIndex(index);

    if (index !== null) setFormData(rows[index]);
    else
      setFormData({
        slno: "",
        title: "",
        customer: "",
        idst: "",
        date: "",
        type: "",
        value: "",
        status: "",
        owner: "",
      });

    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const validateDate = (dateStr) => {
    return /^\d{2}-\d{2}-\d{4}$/.test(dateStr);
  };

  const handleSave = () => {
    if (!validateDate(formData.date)) {
      alert("Date must be in DD-MM-YYYY format");
      return;
    }

    if (editIndex === null) {
      setRows([
        ...rows,
        { ...formData, slno: rows.length + 1 }, // Auto numbering
      ]);
    } else {
      const updated = [...rows];
      updated[editIndex] = formData;
      setRows(updated);
    }

    setOpen(false);
  };

  const handleDelete = (index) => {
    const updated = rows.filter((_, i) => i !== index);
    updated.forEach((row, i) => (row.slno = i + 1));
    setRows(updated);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Button
        variant="contained"
        onClick={() => handleOpen()}
        sx={{ marginBottom: 2 }}
      >
        Add Row
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            {[
              //"Sl No",
              "Lead Title",
              "Customer",
              "IDST/IUST",
              "Date",
              "Tender Type",
              "Value without Tax (Cr)",
              "Status",
              "Lead Owner",
              "Actions",
            ].map((head) => (
              <TableCell key={head} sx={{ fontWeight: "bold" }}>
                {head}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.slno}</TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.customer}</TableCell>
              <TableCell>{row.idst}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.value}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.owner}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleOpen(index)}>
                  Edit
                </Button>
                <Button size="small" color="error" onClick={() => handleDelete(index)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{editIndex === null ? "Add Row" : "Edit Row"}</DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: "grid", gap: 2, marginTop: 1 }}>
            <TextField
              label="Lead Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <TextField
              label="Customer"
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            />

            <TextField
              select
              label="IDST / IUST"
              value={formData.idst}
              onChange={(e) => setFormData({ ...formData, idst: e.target.value })}
            >
              {idstOptions.map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Date (DD-MM-YYYY)"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />

            <TextField
              select
              label="Tender Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              {tenderOptions.map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Value Without Tax (Cr)"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            />

            <TextField
              select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              {statusOptions.map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Lead Owner"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
