import React, { useState, useEffect } from "react";
import {
  Box,
  MenuItem,
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TextField,
  Button,
  TableCell,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// Styled Table Container
const StyledTableContainer = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  overflowX: "auto",
  padding: theme.spacing(2),
  borderRadius: "16px",
}));

// Mock API
const mockApi = {
  resumes: [
    {
      _id: "1",
      clientName: "Acme Corp",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      salary: "12 LPA",
      status: "Interview scheduled",
      comments: "Strong experience in React.",
      consultantName: "Jane Smith",
      skillset: "React, Node.js, MongoDB",
      noticePeriod: "30 days",
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      _id: "2",
      clientName: "Global Solutions",
      email: "jane.doe@example.com",
      phone: "987-654-3210",
      salary: "15 LPA",
      status: "Waiting for slot",
      comments: "Needs follow-up.",
      consultantName: "Mark Johnson",
      skillset: "Angular, Java, MySQL",
      noticePeriod: "Immediate",
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
  ],
  fetchResumes: async () =>
    new Promise((resolve) => setTimeout(() => resolve(mockApi.resumes), 500)),
};

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [salarySort, setSalarySort] = useState(""); // "highToLow" or "lowToHigh"
  const [noticeSort, setNoticeSort] = useState(""); // "shortest" or "longest"

  useEffect(() => {
    const fetchData = async () => {
      const data = await mockApi.fetchResumes();
      setResumes(data);
    };
    fetchData();
  }, []);

  // Prepare displayed resumes
  let displayedResumes = [...resumes];

  // Apply search
  displayedResumes = displayedResumes.filter(
    (res) =>
      searchText === "" ||
      res.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
      res.skillset.toLowerCase().includes(searchText.toLowerCase())
  );

  // Salary sorting
  if (salarySort) {
    displayedResumes.sort((a, b) => {
      const aSalary = parseFloat(a.salary);
      const bSalary = parseFloat(b.salary);
      return salarySort === "highToLow" ? bSalary - aSalary : aSalary - bSalary;
    });
  }

  // Notice period sorting
  if (noticeSort) {
    const noticeOrder = { Immediate: 0, "30 days": 30, "2 months": 60, "3 months": 90 };
    displayedResumes.sort((a, b) => {
      const aNotice = noticeOrder[a.noticePeriod] ?? 999;
      const bNotice = noticeOrder[b.noticePeriod] ?? 999;
      return noticeSort === "shortest" ? aNotice - bNotice : bNotice - aNotice;
    });
  }

  const handleAddExtraInfo = (id) => {
    const resume = resumes.find((r) => r._id === id);
    const extraInfo = prompt("Enter extra info for " + resume.clientName);
    if (extraInfo) {
      resume.comments += ` | ${extraInfo}`;
      setResumes([...resumes]);
    }
  };

  const handleEditResume = (id) => {
    const resume = resumes.find((r) => r._id === id);
    setSelectedResume({ ...resume });
    setOpenEditModal(true);
  };

  const handleModalChange = (field) => (e) => {
    setSelectedResume((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSaveModal = () => {
    setResumes(resumes.map((r) => (r._id === selectedResume._id ? selectedResume : r)));
    setOpenEditModal(false);
    setSelectedResume(null);
  };

  return (
    <>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mt: 4, fontWeight: 700, textAlign: "center" }}>
          Resume Dashboard
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          {/* Search */}
          <TextField
            label="Search by Name or Skillset"
            variant="outlined"
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ flex: 1, minWidth: 250 }}
          />

          {/* Salary Sort */}
          <TextField
            select
            label="Sort Salary"
            value={salarySort}
            onChange={(e) => setSalarySort(e.target.value)}
            size="small"
            sx={{ width: 150 }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="highToLow">High to Low</MenuItem>
            <MenuItem value="lowToHigh">Low to High</MenuItem>
          </TextField>

          {/* Notice Period Sort */}
          <TextField
            select
            label="Sort Notice Period"
            value={noticeSort}
            onChange={(e) => setNoticeSort(e.target.value)}
            size="small"
            sx={{ width: 150 }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="shortest">Shortest to Longest</MenuItem>
            <MenuItem value="longest">Longest to Shortest</MenuItem>
          </TextField>
        </Box>

        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Employee Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Skillset</TableCell>
                <TableCell>Notice Period</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Resume</TableCell>
                <TableCell>Consultant</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {displayedResumes.map((res) => (
                <TableRow key={res._id} hover>
                  <TableCell>{res.clientName}</TableCell>
                  <TableCell>{res.email}</TableCell>
                  <TableCell>{res.phone}</TableCell>
                  <TableCell>{res.salary}</TableCell>
                  <TableCell>{res.skillset}</TableCell>
                  <TableCell>{res.noticePeriod}</TableCell>
                  <TableCell>{res.status}</TableCell>
                  <TableCell>{res.comments}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => window.open(res.fileUrl, "_blank")}>
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>{res.consultantName}</TableCell>
                  <TableCell>
                    <IconButton color="success" onClick={() => handleAddExtraInfo(res._id)}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleEditResume(res._id)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Container>

      {/* Edit Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Resume</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Employee Name"
            fullWidth
            value={selectedResume?.clientName || ""}
            onChange={handleModalChange("clientName")}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            value={selectedResume?.email || ""}
            onChange={handleModalChange("email")}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Phone"
            fullWidth
            value={selectedResume?.phone || ""}
            onChange={handleModalChange("phone")}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Salary"
            fullWidth
            value={selectedResume?.salary || ""}
            onChange={handleModalChange("salary")}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Skillset"
            fullWidth
            value={selectedResume?.skillset || ""}
            onChange={handleModalChange("skillset")}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Notice Period"
            fullWidth
            value={selectedResume?.noticePeriod || ""}
            onChange={handleModalChange("noticePeriod")}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Status"
            fullWidth
            value={selectedResume?.status || ""}
            onChange={handleModalChange("status")}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Comments"
            fullWidth
            multiline
            rows={3}
            value={selectedResume?.comments || ""}
            onChange={handleModalChange("comments")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveModal}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Dashboard;