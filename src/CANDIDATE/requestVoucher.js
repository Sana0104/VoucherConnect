import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Typography,
  Dialog,
  DialogActions,
  DialogContent
} from '@mui/material';
import cloudData from "./examdata.json";
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import WarningIcon from '@mui/icons-material/Warning';

const RequestVoucherForm = () => {
  const [formData, setFormData] = useState({
    candidateName: '',
    cloudPlatform: '',
    cloudExam: '',
    doSelectScore: '',
    doSelectScoreImage: null,
    plannedExamDate: '',
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState(false);
  const username = location.state?.username || '';
  const [formErrors, setFormErrors] = useState({});
  const [examOptions, setExamOptions] = useState([]);

  useEffect(() => {
    const obj = localStorage.getItem("userInfo");
    const { name } = JSON.parse(obj);
    setFormData((prevFormData) => ({
      ...prevFormData,
      candidateName: name,
    }));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'doSelectScoreImage') {
      setFormData({
        ...formData,
        doSelectScoreImage: event.target.files[0],
      });
      validateFile(event.target.files[0]);
    } else {
      if (name === 'cloudPlatform' || name === 'cloudExam') {
        setFormData({
          ...formData,
          [name]: value,
          doSelectScore: '', // Clear doSelectScore when cloudPlatform or cloudExam changes
        });
      } else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const validateFile = (file) => {
    const errorsCopy = { ...formErrors };
    if (!file) {
      errorsCopy.doSelectScoreImage = 'Choose a file';
    } else {
      errorsCopy.doSelectScoreImage = '';
    }
    setFormErrors(errorsCopy);
  };

  const handleCloudPlatformChange = (event) => {
    const selectedPlatform = event.target.value;
    const errorsCopy = { ...formErrors };
    const selectedCloud = cloudData.cloudPlatforms.find(
      (cloud) => cloud.name === selectedPlatform
    );
    if (selectedCloud) {
      setExamOptions(selectedCloud.exams);
      setFormData({
        ...formData,
        cloudPlatform: selectedPlatform,
        cloudExam: '',
      });
      errorsCopy.cloudPlatform = '';
      setFormErrors(errorsCopy);
    }
  };

  const validateName = (name) => {
    const errorsCopy = { ...formErrors };
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      errorsCopy.candidateName = 'Candidate Name should contain only alphabets';
    } else {
      errorsCopy.candidateName = '';
    }
    setFormErrors(errorsCopy);
  };

  const handleNameChange = (event) => {
    setFormData({
      ...formData,
      candidateName: event.target.value
    });
    validateName(event.target.value);
  };

  const validateScore = (doSelectScore) => {
    const errorsCopy = { ...formErrors };
    const isValidScore = /^-?\d+$/.test(doSelectScore);

    if (!isValidScore || doSelectScore < 0 || doSelectScore > 100) {
      errorsCopy.doSelectScore =
        'Please enter a valid score. It should be a number between 0 and 100.';
    } else if (doSelectScore < 80) {
      errorsCopy.doSelectScore =
        'Since your score is less than 80, you are not eligible for the exam';
    } else {
      errorsCopy.doSelectScore = '';
    }
    setFormErrors(errorsCopy);
  };

  const handleScoreChange = (event) => {
    setFormData({
      ...formData,
      doSelectScore: event.target.value
    });
    validateScore(event.target.value);
  };

  const validateForm = () => {
    let formIsValid = true;
    const errors = {};

    if (!formData.candidateName) {
      errors.candidateName = 'Candidate Name is required';
      formIsValid = false;
    }

    if (!formData.cloudPlatform) {
      errors.cloudPlatform = 'Cloud Name is required';
      formIsValid = false;
    }

    if (!formData.cloudExam) {
      errors.cloudExam = 'Exam Name is required';
      formIsValid = false;
    }

    if (!formData.doSelectScore) {
      errors.doSelectScore = 'Exam Score is required';
      formIsValid = false;
    }

    if (!formData.doSelectScoreImage) {
      errors.doSelectScoreImage = 'doselect score screenshot is required';
      formIsValid = false;
    }

    if (!formData.plannedExamDate) {
      errors.plannedExamDate = 'Tentative Exam Date is required';
      formIsValid = false;
    }

    setFormErrors(errors);
    return formIsValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      if (formData.doSelectScore >= 80) {
        const dataWithUserEmail = {
          ...formData,
          candidateEmail: username,
        };
        const formDataObj = new FormData();
        formDataObj.append('data', new Blob([JSON.stringify(dataWithUserEmail)], {
          type: "application/json"
        }));

        // Use the file input reference to get the file
        formDataObj.append('image', formData.doSelectScoreImage);

        axios
          .post('http://localhost:8085/requests/voucher', formDataObj, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
          })
          .then((response) => {
            console.log('API Response: success');
            setFormData({
              candidateName: '',
              cloudPlatform: '',
              cloudExam: '',
              doSelectScore: '',
              plannedExamDate: '',
            });
            setFormErrors({});
            document.getElementById('fileInput').value = '';
            setTimeout(() => {
              navigate('/candidatedashboard');
            }, 1000);
          })
          .catch((error) => {
            console.error('API Error:', error);
            if (error.response && error.response.status === 404) {
              // Handle 404 error - show a dialog box with the error message
              setOpenDialog(true);
              setDialogMessage(error.response.data.message);
            }
          });
      } else {
        setFormErrors({
          ...formErrors,
          doSelectScore: 'Since your score is less than 80, you are not eligible for the exam',
        });
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const goBack = () => {
    navigate(-1); // This function navigates back to the previous page in history
  };

  const acceptedFileFormats = ['.jpg', '.jpeg', '.png'];


  return (
    <div>
      <Navbar />
      {/* Go Back Button */}
      <Button
        onClick={goBack}
        sx={{
          backgroundColor: '#002D62',
          color: 'white',
          border: '1px solid #CCC',
          borderRadius: '4px',
          padding: '10px',
          margin: '20px 20px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: 'darkblue',
          },
          '&:focus': {
            outline: 'none',
          },
        }}
      >
        Go Back
      </Button>

      <div className='form-container'>
        <h1>Voucher Request Form</h1>
        <FormControl className='form-control-data' variant="outlined" size="sl" margin="normal">
          <TextField
            label="Candidate Name"
            name="candidateName"
            value={formData.candidateName}
            disabled // Disable the text field
          />
        </FormControl>
        <FormControl className='form-control-data' variant="outlined" size="sl" margin="normal">
          <InputLabel id="name-select-label">Cloud Name</InputLabel>
          <Select
            labelId="name-select-label"
            label="cloud name"
            value={formData.cloudPlatform}
            onChange={handleCloudPlatformChange}
            name="cloudPlatform"
            error={!!formErrors.cloudPlatform}
          >
            {cloudData.cloudPlatforms.map((cloud) => (
              <MenuItem key={cloud.name} value={cloud.name}>
                {cloud.name}
              </MenuItem>
            ))}
          </Select>
          {formErrors.cloudPlatform && <span className="errors">{formErrors.cloudPlatform}</span>}
        </FormControl>
        <FormControl className='form-control-data' variant="outlined" size="sl" margin="normal">
          <InputLabel id="name-select-label">Exam Name</InputLabel>
          <Select
            labelId="name-select-label"
            label="exam name"
            value={formData.cloudExam}
            onChange={handleChange}
            name="cloudExam"
            error={!!formErrors.cloudExam}
          >
            {examOptions.map((exam) => (
              <MenuItem key={exam} value={exam}>
                {exam}
              </MenuItem>
            ))}
          </Select>
          {formErrors.cloudExam && <span className="errors">{formErrors.cloudExam}</span>}
        </FormControl>
        <FormControl className='form-control-data' variant="outlined" size="sl" margin="normal">
          <TextField
            type="text"
            label="doSelect Exam Score"
            name="doSelectScore"
            value={formData.doSelectScore}
            onChange={handleScoreChange}
            error={!!formErrors.doSelectScore}
            helperText={formErrors.doSelectScore}
          />
        </FormControl>
        <FormControl className='form-control-data' variant='outlined' size="sl" margin="normal">
          <input
            id="fileInput"
            type="file"
            accept=".jpg,.jpeg,.png"
            name="doSelectScoreImage"
            onChange={handleChange}
            disabled={!formData.doSelectScore || formData.doSelectScore < 80}
          />
          {formErrors.doSelectScoreImage && (
            <span className="errors">{formErrors.doSelectScoreImage}</span>

          )}
          <span className="file-format-info">
            Accepted formats: {acceptedFileFormats.join(', ')}
          </span>
        </FormControl>
        <FormControl className='form-control-data' variant="outlined" size="sl" margin="normal">
          <TextField
            type="date"
            label="Tentative Exam Date"
            name="plannedExamDate"
            value={formData.plannedExamDate}
            onChange={handleChange}
            disabled={!formData.doSelectScoreImage}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: new Date().toISOString().split('T')[0],
              max: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            }}
            error={!!formErrors.plannedExamDate}
            helperText={formErrors.plannedExamDate}
          />
        </FormControl>
        <Button onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
        <DialogContent sx={{ textAlign: 'center' }}>
          <WarningIcon sx={{ fontSize: 80, color: 'orange' }} />
          <Typography variant="body1" sx={{ textShadow: '1px  #000' }}>
            {/* You have already requested a voucher for this exam. */}
            {dialogMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleCloseDialog} color="primary" sx={{
            backgroundColor: '#002D62',
            color: 'white',
            '&:hover': {
              backgroundColor: 'darkblue',
            },
          }}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RequestVoucherForm;