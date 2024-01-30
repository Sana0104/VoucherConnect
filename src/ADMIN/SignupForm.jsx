// Import necessary components and libraries
import React, { useState } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './SignUp.css'; // Import your CSS file

// Functional component for the signup form
function SignupForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [reenterPassword, setReenterPassword] = useState('');
  const [showModal, setShowModal] = useState(false); // Define showModal state
  const [modalMessage, setModalMessage] = useState(''); // Define modalMessage state

  // Function to handle changes in the re-enter password field
  const handleReenterPasswordChange = (e) => {
    setReenterPassword(e.target.value);
    validateField('reenterPassword', e.target.value);
  };

  // Function to toggle password visibility
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // State variables for form data and form errors
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    password: '',
    mentorEmail: '',
    role: 'ROLE_CANDIDATE',
  });

  const [formErrors, setFormErrors] = useState({
    userName: '',
    userEmail: '',
    mentorEmail: '',
    password: '',
    reenterPassword: '',
  });

  // Function to open modal with a message
  const openModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    validateField(id, value);
  };

  // Function to validate form fields
  const validateField = (field, value) => {
    let errorMessage = '';

    if (field === 'userEmail') {
      if (!value.match(/^[a-zA-Z0-9._%+-]+@capgemini\.com$/)) {
        errorMessage = ' Please use a @capgemini.com email address.';
      }
    } else if (field === 'mentorEmail') {
      if (!value.match(/^[a-zA-Z0-9._%+-]+@capgemini\.com$/)) {
        errorMessage = ' Please use a @capgemini.com email address for mentor.';
      }
    } else if (field === 'password') {
      if (value.length < 6) {
        errorMessage = 'Password must be at least 6 characters long';
      }
    } else if (field === 'userName') {
      const nameRegex = /^[a-zA-Z]{5,}$/;
      if (!nameRegex.test(value)) {
        errorMessage = 'Name must be at least 5 characters long and contain only alphabets.';
      }
    } else if (field === 'reenterPassword') {
      if (value !== formData.password) {
        errorMessage = 'Passwords do not match';
      }
    }

    setFormErrors({ ...formErrors, [field]: errorMessage });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    for (const field in formErrors) {
      if (formErrors[field]) {
        openModal('Please fix the form errors before submitting.');
        return;
      }
    }

    // API endpoint
    var url = 'http://localhost:9092/user/register';
    var result = axios.post(url, formData);

    result
      .then((res) => {
        console.log(res.data);
        localStorage.setItem('userName', formData.userName);
        navigate('/');
      })
      .catch((err) => {
        console.log(err.response.data.message);

        if (err.response.status === 409) {
          openModal('User with this email already exists.');
        } else {
          openModal('Register Not Done ' + err.response.data.message);
        }
      });
  };

  return (
    <>
      <MDBContainer fluid className='p-10'>
        <MDBRow>
          <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
            <h1 style={{ marginLeft: '100px', fontSize: '3.5rem', color: 'blue' }}>Voucher ~ Connect</h1>
          </MDBCol>

          <MDBCol md='6'>
            <MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
              <form onSubmit={handleSubmit}>
                <MDBCardBody className='p-4 w-100 d-flex flex-column'>
                  <h2 className='fw-bold mb-2 text-center'>Sign up for User</h2>
                  <center className='text-dark-50 mb-3'>Please enter your details!</center>
                  <MDBRow>
                    <MDBCol col='6'>
                      <MDBInput
                        id='userName'
                        type='text'
                        label='Name'
                        value={formData.userName}
                        onChange={handleInputChange}
                        placeholder='Name'
                      />
                      {formErrors.userName && <span className='text-danger'>{formErrors.userName}</span>}
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol col='6'>
                      <MDBInput
                        id='userEmail'
                        type='email'
                        label='Email'
                        value={formData.userEmail}
                        onChange={handleInputChange}
                        placeholder='Email address'
                      />
                      {formErrors.userEmail && <span className='text-danger'>{formErrors.userEmail}</span>}
                    </MDBCol>
                    <MDBRow>
                    <MDBCol col='6'>
                      <MDBInput
                        id="mentorEmail"
                        type="email"
                        label="Mentor Email"
                        value={formData.mentorEmail}
                        onChange={handleInputChange}
                        placeholder="Mentor's email address"
                      />
                      {formErrors.mentorEmail && <span className="text-danger">{formErrors.mentorEmail}</span>}
                    </MDBCol>
                  </MDBRow>
                    <MDBCol col='6'>
                      <div className='position-relative'>
                      <MDBInput
  id='password'
  label='Password'
  type={showPassword ? 'text' : 'password'}
  value={formData.password}
  onChange={handleInputChange}
  placeholder='Password'
  className='input-container'
/>
<FontAwesomeIcon
  icon={showPassword ? faEyeSlash : faEye}
  onClick={toggleShowPassword}
  className='password-icon'
/>


                      </div>
                      {formErrors.password && <span className='text-danger'>{formErrors.password}</span>}
                    </MDBCol>
                    <MDBCol col='6'>
                    <MDBInput
  id='reenterPassword'
  label='Re-enter Password'
  type={showPassword ? 'text' : 'password'}
  value={reenterPassword}
  onChange={handleReenterPasswordChange}
  placeholder='Re-enter password'
  className='input-container'
/>
<FontAwesomeIcon
  icon={showPassword ? faEyeSlash : faEye}
  onClick={toggleShowPassword}
  className='reenter-password-icon'
/>

                      {formErrors.reenterPassword && <span className='text-danger'>{formErrors.reenterPassword}</span>}
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
                <div className='text-center'>
                  <button className='btn btn-primary' type='submit' style={{ width: '10rem' }}>
                    Sign up
                  </button>
                </div>
              </form>
              <center style={{ padding: 5 }}>
                Already have an account?<Link to='/'>Login Here</Link>
              </center>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SignupForm;
