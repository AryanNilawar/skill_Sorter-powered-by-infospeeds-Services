import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Grid,
  Box,
  InputLabel,
  FormControl,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

// Custom theme for a modern look
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f4f6f8",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h4: {
      fontWeight: 600,
      color: "#333",
    },
    body1: {
      color: "#555",
    },
  },
});

// Styled components for better structure and aesthetics
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
}));

const StyledTableContainer = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  overflowX: "auto",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  borderRadius: "8px",
  fontWeight: "bold",
  textTransform: "none",
}));

function ResumeDashboard() {
  const [file, setFile] = useState(null);
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rate, setRate] = useState("");
  const [status, setStatus] = useState("Waiting for slot");
  const [consultantName, setConsultantName] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await axios.get("/api/resumes");
      setResumes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("clientName", clientName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("rate", rate);
    formData.append("status", status);
    formData.append("consultantName", consultantName);
    formData.append("comments", comments);

    try {
      await axios.post("/api/resumes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Resume uploaded successfully!");
      fetchResumes();
      // Reset form fields
      setFile(null);
      setCandidateName("");
      setConsultantName("");
      setSkills("");
      setExperience("");
      setNoticePeriod("");
      setLocation("");
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" style={{ marginTop: "40px", backgroundColor: theme.palette.background.default, padding: "20px" }}>
        <StyledPaper>
          <Typography variant="h4" gutterBottom align="center">
            🚀 Upload a New Resume
          </Typography>
          <form onSubmit={handleUpload}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Select a PDF file to upload:
                </Typography>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                  style={{
                    display: "block",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    width: "100%",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Candidate Name"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Consultant Name"
                  value={consultantName}
                  onChange={(e) => setConsultantName(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Skills (e.g., React, Node.js, SQL)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Experience (years)"
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Notice Period"
                  value={noticePeriod}
                  onChange={(e) => setNoticePeriod(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>

            </Grid>
            <Box textAlign="center">
              <StyledButton variant="contained" color="primary" type="submit">
                Upload Resume
              </StyledButton>
            </Box>
          </form>
        </StyledPaper>

        <Typography variant="h4" gutterBottom align="center" style={{ marginTop: "40px" }}>
          📊 Candidate Dashboard
        </Typography>

        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Client Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Consultant</TableCell>
                <TableCell>Comments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resumes.map((res) => (
                <TableRow key={res._id} hover>
                  <TableCell>{res.candidateName}</TableCell>
                  <TableCell>{res.consultantName}</TableCell>
                  <TableCell>{res.skills.join(", ")}</TableCell>
                  <TableCell>{res.experience}</TableCell>
                  <TableCell>{res.noticePeriod}</TableCell>
                  <TableCell>{res.location}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => window.open(res.fileUrl, "_blank")}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Container>
    </ThemeProvider>
  );
}

export default ResumeDashboard;