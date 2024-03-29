import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../features/auth';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Login() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username } = useSelector((state) => state.auth.value);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [formData, setFormData] = useState({
    usermail: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({
    usermail: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (id === 'usermail') {
      validateEmail(value);
    } else if (id === 'password') {
      validatePassword(value);
    }
  };

  const validateEmail = (value) => {
    let errorMessage = '';
    if (!value) {
      errorMessage = 'Email is required';
    } else if (!value.match(/^[a-zA-Z0-9._%+-]+@capgemini\.com$/)) {
      errorMessage = 'Invalid email address. Must contain @ and .com';
    }
    setFormErrors({ ...formErrors, usermail: errorMessage });
  };

  const validatePassword = (value) => {
    let errorMessage = '';
    if (!value) {
      errorMessage = 'Password is required';
    } else if (value.length < 6) {
      errorMessage = 'Password must be at least 6 characters long';
    }
    setFormErrors({ ...formErrors, password: errorMessage });
  };

  const handleLogin = async () => {
    if (formErrors.usermail) {
      return; // If email validation fails, do not attempt login
    }

    var payload = {
      userEmail: formData.usermail,
      password: formData.password,
    };

    var url = 'http://localhost:9092/user/login';

    try {
      const response = await axios.post(url, payload);
      const res = response.data;

      localStorage.setItem('id', res.username);
      localStorage.setItem('userInfo', JSON.stringify(res));

      dispatch(login(res));

      if (res.roles[0] === 'ROLE_CANDIDATE') {
        setTimeout(() => {
          navigate('/candidatedashboard');
        }, 1000);
      } else if (res.roles[0] === 'ROLE_ADMIN') {
        setTimeout(() => {
          navigate('/requests');
        }, 1000);
      }
    } catch (error) {
      setFormErrors({ ...formErrors, password: 'Please Give Correct Email and Password.' });
      console.error('Login error:', error.response.data.message);
    }
  };

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ 
        width: '400px', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', 
        backgroundColor: '#fff', 
        textAlign: 'center',
        border: '1px solid #ddd',
        }}>
        <h2 style={{ marginBottom: '20px', color: '#333', textShadow: '2px 2px 3px rgba(0, 0, 0, 0.1)' }}>Login</h2>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="usermail">Email:</label>
          <input
            type="text"
            id="usermail"
            value={formData.usermail}
            onChange={handleInputChange}
            style={{ 
              width: '90%', 
              padding: '8px', 
              boxSizing: 'border-box', 
              borderRadius: '4px', 
              border: '1px solid #ccc', 
              marginBottom: '5px',
            }}
          />
          {formErrors.usermail && (
            <div style={{ color: 'red', marginTop: '5px' }}>{formErrors.usermail}</div>
          )}
        </div>

        <div>
      <label htmlFor="password">Password:</label>
      <div style={{ position: 'relative' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          value={formData.password}
          onChange={handleInputChange}
          style={{ 
            width: '90%', 
            padding: '8px', 
            boxSizing: 'border-box', 
            borderRadius: '4px', 
            border: '1px solid #ccc', 
            marginBottom: '5px',
          }}
        />
        <FontAwesomeIcon
          icon={showPassword ? faEye : faEyeSlash}
          onClick={togglePasswordVisibility}
          style={{ 
            position: 'absolute', 
            right: '10px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            marginRight:'15px'
          }}
        />
      </div>
      {formErrors.password && (
        <div style={{ color: 'red', marginTop: '5px' }}>{formErrors.password}</div>
      )}
        </div>

        <button onClick={handleLogin} style={{ 
          width: '30%', 
          padding: '10px', 
          background: '#007bff', 
          color: '#fff', 
          borderRadius: '4px', 
          cursor: 'pointer',
          border: '1px solid #007bff',
          boxShadow: '2px 2px 3px rgba(0, 0, 0, 0.1)', // Add box shadow for a 3D effect
        }}>Signin</button>

        {/* <div style={{ marginTop: '20px', color: '#333', textShadow: '2px 2px 3px rgba(0, 0, 0, 0.1)' }}>Hi {username}</div> */}

        {/* <button onClick={logoutHandler} style={{ marginTop: '10px', padding: '10px', background: '#dc3545', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>Logout</button> */}

        <p style={{ marginTop: '20px', color: '#333', textShadow: '2px 2px 3px rgba(0, 0, 0, 0.1)' }}>Don't have an account? <Link to="/signup">Register</Link></p>
      </div>
    </div>
  );
}

export default Login;
