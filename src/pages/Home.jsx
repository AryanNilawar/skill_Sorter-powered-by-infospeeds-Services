import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Alert,
  InputAdornment,
  FormHelperText,
  CssBaseline
} from '@mui/material';
import { CloudUpload,Home as HomeIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        select: {
          '&:focus': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
  },
});

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: '16px',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    backgroundColor: '#fff',
    padding: '0 8px',
    borderRadius: '4px',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  }
}));

const UploadButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  height: '120px',
  border: '2px dashed',
  borderColor: '#1976d2',
  '&:hover': {
    borderColor: '#1565c0',
    backgroundColor: 'rgba(25, 118, 210, 0.04)'
  }
}));

const Home = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    email: '',
    contact: '',
    salary: '',
    skillset: '',
    noticePeriod: '30 days',
    status: 'waiting for slot',
    consultantName: '',
    comments: '',
    resumeFile: null
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if file is PDF or DOC/DOCX
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          resumeFile: 'Please upload a PDF or Word document'
        }));
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          resumeFile: 'File size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        resumeFile: file
      }));
      setFileName(file.name);
      setErrors(prev => ({
        ...prev,
        resumeFile: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employeeName.trim()) {
      newErrors.employeeName = 'Employee name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    }

    if (!formData.salary.trim()) {
      newErrors.salary = 'Salary is required';
    }

    if (!formData.skillset.trim()) {
      newErrors.skillset = 'Skillset is required';
    }

    if (!formData.noticePeriod) {
      newErrors.noticePeriod = 'Notice period is required';
    }

    if (!formData.resumeFile) {
      newErrors.resumeFile = 'Please upload your resume';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (validateForm()) {
      // Here you would typically send the data to your backend
      console.log('Form data:', formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Reset form after successful submission
      setFormData({
        employeeName: '',
        email: '',
        contact: '',
        salary: '',
        skillset: '',
        noticePeriod: '30 days',
        status: 'waiting for slot',
        consultantName: '',
        comments: '',
        resumeFile: null
      });
      setFileName('');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <StyledPaper elevation={3}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ 
              fontWeight: 700,
              color: 'primary.main',
              mb: 4,
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Upload Your Resume
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Resume uploaded successfully!
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Resume Upload Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Upload Resume
              </Typography>
              
              {fileName ? (
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'success.main',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: 'rgba(76, 175, 80, 0.08)'
                  }}
                >
                  <Typography variant="body1" gutterBottom>
                    📄 {fileName}
                  </Typography>
                </Box>
              ) : (
                <UploadButton
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  fullWidth
                >
                  <Box>
                    <CloudUpload sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body1">
                      Click to upload resume
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      (PDF, DOC, DOCX - Max 5MB)
                    </Typography>
                  </Box>
                  <VisuallyHiddenInput
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                </UploadButton>
              )}
              {errors.resumeFile && (
                <FormHelperText error sx={{ mt: 1, textAlign: 'center' }}>
                  {errors.resumeFile}
                </FormHelperText>
              )}
            </Box>

            <Grid container spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee Name"
                  value={formData.employeeName}
                  onChange={handleInputChange('employeeName')}
                  error={!!errors.employeeName}
                  helperText={errors.employeeName}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  value={formData.contact}
                  onChange={handleInputChange('contact')}
                  error={!!errors.contact}
                  helperText={errors.contact}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">+</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleInputChange('salary')}
                  error={!!errors.salary}
                  helperText={errors.salary}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Skillset"
                  value={formData.skillset}
                  onChange={handleInputChange('skillset')}
                  error={!!errors.skillset}
                  helperText={errors.skillset}
                  required
                  multiline
                  rows={2}
                  placeholder="e.g., React, Node.js, Python, AWS"
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{mb: 2, mt: 4 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ width: 200 }}>
                <StyledFormControl fullWidth required error={!!errors.noticePeriod}>
                  <InputLabel id="notice-period-label">Notice Period</InputLabel>
                  <Select
                    labelId="notice-period-label"
                    value={formData.noticePeriod}
                    label="Notice Period"
                    onChange={handleInputChange('noticePeriod')}
                    displayEmpty
                    renderValue={formData.noticePeriod !== "" ? undefined : () => "Select notice period"}
                  >
                    <MenuItem value="30 days">30 days</MenuItem>
                    <MenuItem value="2 months">2 months</MenuItem>
                    <MenuItem value="3 months">3 months</MenuItem>
                  </Select>
                  {errors.noticePeriod && (
                    <FormHelperText error>{errors.noticePeriod}</FormHelperText>
                  )}
                </StyledFormControl>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledFormControl fullWidth>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    value={formData.status}
                    label="Status"
                    onChange={handleInputChange('status')}
                  >
                    <MenuItem value="waiting for slot">Waiting for Slot</MenuItem>
                    <MenuItem value="accepted">Accepted</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </StyledFormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Consultant Name"
                  value={formData.consultantName}
                  onChange={handleInputChange('consultantName')}
                />
              </Grid>
            </Grid>

            {/* Comments */}
            <Box sx={{ mt: 4, mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Comments
              </Typography>
              <TextField
                fullWidth
                value={formData.comments}
                onChange={handleInputChange('comments')}
                multiline
                rows={4}
                placeholder="Additional comments or notes..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </Box>

            {/* Submit Button */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                }}
              >
                Submit Resume
              </Button>
            </Box>
          </Box>
        </StyledPaper>
      </Container>
    </ThemeProvider>
  );
};

export default Home;