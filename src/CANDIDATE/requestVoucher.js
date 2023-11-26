import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Input,
  Snackbar,
  Alert
} from '@mui/material';
import cloudData from "./examdata.json";
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';


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
  const username = location.state?.username || '';
  const [formErrors, setFormErrors] = useState({});
  const [examOptions, setExamOptions] = useState([]);
  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: '',
    severity: 'success', 
  });
  const handleChange = (event) => {
    const { name, value,files} = event.target;
    if (name === 'doSelectScoreImage') {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (upload) => {
          const base64String = upload.target.result;
          setFormData({
            ...formData,
            [name]: base64String, 
          });
        };
    
        reader.readAsDataURL(file);
        validateFile(file);
      } 
      else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
      setFormErrors({ ...formErrors, [name]: '' });
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
    }else {
        errorsCopy.candidateName = ''; 
        }
        setFormErrors(errorsCopy); 
  };
  const handleNameChange=(event)=>{
    setFormData({
        ...formData,
        candidateName:event.target.value
      });
      validateName(event.target.value);
  }
  const validateScore = (doSelectScore) => {
    const errorsCopy = { ...formErrors };  
    const isValidScore = /^[0-9]+$/.test(doSelectScore) || /^-[0-9]+$/.test(doSelectScore);

  if (!isValidScore || doSelectScore < 0 || doSelectScore > 100) {
    errorsCopy.doSelectScore =
      'Please enter a valid score. It should be a number between 0 and 100 and negative symbol should be at the beginning.';
  } 
    else {
      errorsCopy.doSelectScore = ''; 
    }
    setFormErrors(errorsCopy); 
  };
  const handleScoreChange=(event)=>{
    setFormData({
        ...formData,
        doSelectScore:event.target.value
      });
      validateScore(event.target.value);
  }

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
      errors.doSelectScoreImage = 'Evidence file is required';
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
    if(validateForm()){
        if (formData.doSelectScore >= 80) {
                const dataWithUserEmail = {
                    ...formData,
                    candidateEmail: username, 
                };
                console.log(dataWithUserEmail)
                axios.post('http://localhost:8085/requests/voucher', dataWithUserEmail)
                .then((response) => {
                    console.log('API Response:success');
                setFormData({
                    candidateName: '',
                    cloudPlatform: '',
                    cloudExam: '',
                    doSelectScore: '',
                    plannedExamDate: '',
                  });
                  setSnackbarInfo({
                    open: true,
                    message: 'Voucher request submitted successfully!',
                    severity: 'success',
                  });
                  document.getElementById('fileInput').value = '';
                  setTimeout(() => {
                    navigate('/candidatedashboard'); 
                  }, 2000);
                })
                .catch((error) => {
                console.error('API Error:', error);
            });
        } 
        else {
            setFormData({
                candidateName: '',
                cloudPlatform: '',
                cloudExam: '',
                doSelectScore: '',
                plannedExamDate: '',
              });
              document.getElementById('fileInput').value = '';
            setSnackbarInfo({
              open: true,
              message: 'Your score is less than 80. You are not eligible for the voucher.',
              severity: 'error',
            });
        }
    }
  };

  return (
    
    <div >
      <Navbar/>
        <div className='form-container'>
        <h1>Voucher Request Form</h1>
            <FormControl className='form-control-data'
            variant="outlined"
            size="sl"
            margin="normal">
            <TextField
                label="Candidate Name"
                name="candidateName"
                value={formData.candidateName}
                onChange={handleNameChange}
                error={!!formErrors.candidateName}
                helperText={formErrors.candidateName}
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
            {formErrors.cloudPlatform && <span  className="errors">{formErrors.cloudPlatform}</span>}
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
            {formErrors.cloudExam && <span  className="errors">{formErrors.cloudExam}</span>}
        </FormControl>
        <FormControl className='form-control-data'
            variant="outlined"
            size="sl"
            margin="normal">
            <TextField
                type="number"
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
            accept=".pdf,.jpg,.jpeg,.png"
            name="doSelectScoreImage"
            onChange={handleChange}
            />
            {formErrors.doSelectScoreImage && (
            <span className="errors">{formErrors.doSelectScoreImage}</span>
          )}
        </FormControl>
        <FormControl className='form-control-data'
            variant="outlined"
            size="sl"
            margin="normal">
            <TextField
                type="date"
                label="Tentative Exam Date"
                name="plannedExamDate"
                value={formData.plannedExamDate}
                onChange={handleChange}
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
        <Snackbar
        open={snackbarInfo.open}
        autoHideDuration={6000}
        onClose={() => setSnackbarInfo({ ...snackbarInfo, open: false })}
      >
        <Alert onClose={() => setSnackbarInfo({ ...snackbarInfo, open: false })} severity={snackbarInfo.severity}>
          {snackbarInfo.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RequestVoucherForm;
