import React, { useState } from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox,
    MDBIcon
  }
    from 'mdb-react-ui-kit';
  import 'bootstrap/dist/css/bootstrap.css'
 //import "./uselogincss.css"
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignupForm() {

    const navigate =useNavigate();
    const [formData, setFormData] = useState({
        userName: '',
        userEmail: '',
        password: '',
        role:'ROLE_CANDIDATE'
    });

    const [formErrors, setFormErrors] = useState({
        userName: '',
        userEmail: '',
        password: '',
    
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        // You can add validation here and update formErrors.
        validateField(id, value);
    };

    const validateField = (field, value) => {
        let errorMessage = '';

        if (field === 'userEmail') {
            if (!value.match(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/)) {
                errorMessage = 'Invalid email address';
            }
        } else if (field === 'password') {
            if (value.length < 6) {
                errorMessage = 'Password must be at least 6 characters long';
            }
        
        }else if (field === 'userName') {
            if (value.length < 5) {
                errorMessage = 'Name must be at least 5 character long';
            }
       
        }
        // Add validation logic for other fields here.

        setFormErrors({ ...formErrors, [field]: errorMessage });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Check if there are any validation errors
        for (const field in formErrors) {
            if (formErrors[field]) {
                alert('Please fix the form errors before submitting.');
                return;
            }
        }
        console.log(formData);
        var url = "http://localhost:9092/user/register"
      var result = axios.post(url, formData);
    //   console.log("ok")
      result.then((res) => {
        console.log(res.data);
        localStorage.setItem('userName', formData.userName);
        navigate('/')
        console.log("HI");
      }).catch((err) => {
        alert("Register Not Done " + err)
        // setShow(false);
      })

        // If there are no errors, you can proceed with form submission.
        // Perform your form submission logic here, e.g., sending data to the server.
    };

    return (
        <>
          

            <MDBContainer fluid className='p-10'>

                <MDBRow>

                    <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>

                        {/* <h1 className="my-5 display-3 fw-bold ls-tight px-3">
                           
                            <span className="text-primary">Voucher ~ Connect </span>
                        </h1> */}

                        <h1 style={{marginLeft:"100px", fontSize:"3.5rem", color: "blue"}}>
                        Voucher ~ Connect
                        </h1>
                    </MDBCol>

                    <MDBCol md='6'>

                        <MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
                            <form onSubmit={handleSubmit}>
                                <MDBCardBody className='p-4 w-100 d-flex flex-column'>

                                    <h2 className="fw-bold mb-2 text-center">Sign up for User</h2>
                                    <center className="text-dark-50 mb-3">Please enter your details!</center>

                                    <MDBRow>
                                        <MDBCol col='6'>
                                            <MDBInput
                                                id="userName"
                                                type="text"
                                                label="Name"
                                                value={formData.userName}
                                                onChange={handleInputChange}
                                                placeholder="Name"
                                            />
                                            {formErrors.userName && <span className="text-danger">{formErrors.userName}</span>}
                                        </MDBCol>

                                      
                                    </MDBRow>
                                    <MDBRow>

                                        <MDBCol col='6'>
                                            <MDBInput
                                                id="userEmail"
                                                type="email"
                                                label="Email"
                                                value={formData.userEmail}
                                                onChange={handleInputChange}
                                                placeholder="Email address"
                                            />
                                            {formErrors.userEmail && <span className="text-danger">{formErrors.userEmail}</span>}
                                            {/* {emailValid ? <div></div> : <div>  <span className="text-danger">Email id is not valid</span></div>} */}
                                        </MDBCol>

                                        <MDBCol col='6'>
                                            <MDBInput
                                                id="password"
                                                label="Password"
                                                type="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Password"
                                            />
                                            {formErrors.password && <span className="text-danger">{formErrors.password}</span>}
                                            {/* {passwordValid ? <div></div> : <div>  <span className="text-danger">Password is not valid</span></div>}  */}
                                        </MDBCol>
                                    </MDBRow>
                                   




                                </MDBCardBody>
                                <div className="text-center">
                                <button className='btn btn-primary' type='submit'  style={{ width: "10rem" }}>
                                    Sign up
                                </button>
                            </div>
                            </form>
                            

                            <center style={{ padding: 5 }}>Already have an account?<Link to="/">Login Here</Link></center>

                        </MDBCard>

                    </MDBCol>

                </MDBRow>

            </MDBContainer>
        </>

    );
}

export default SignupForm;
