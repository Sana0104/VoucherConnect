import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
 
const UserProfile = () => {
 
  const obj = localStorage.getItem("userInfo");
  const { username,name } = JSON.parse(obj);
  const navigate = useNavigate();
 
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('id');
    console.log("Logged out...");
   
    navigate('/');
  };
 
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Avatar
        alt="Profile"
        style={{ width: '100px', height: '100px', marginBottom: '10px', marginLeft: '90px' }}
      >
        {name.charAt(0)}
      </Avatar>
      <h2>User Profile</h2>
      <p>Name: {name}</p>
      <p>Email: {username}</p>
      <Button variant="outlined" color="primary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default UserProfile;

