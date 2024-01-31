

import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios'; // Add this import
import UserProfile from './UserProfile';
import Popover from '@mui/material/Popover';
 
const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileImageURL, setProfileImageURL] = useState(null); // State to store the profile image URL
  const obj = localStorage.getItem("userInfo");
  const { name, username } = JSON.parse(obj);

  useEffect(() => {
    const fetchProfileImageURL = async () => {
      try {
        const response = await axios.get(`http://localhost:9092/user/getProfileImageURL/${username}`, {
          responseType: 'arraybuffer',
        });

        const blob = new Blob([response.data], { type: 'image/jpeg' });
        const reader = new FileReader();

        reader.onloadend = () => {
          setProfileImageURL(reader.result);
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error fetching image URL:', error.message);
      }
    };

    fetchProfileImageURL();
  }, [username]);

  const openProfilePopup = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeProfilePopup = () => {
    setAnchorEl(null);
  };

  const isProfilePopupOpen = Boolean(anchorEl);

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: 'black', height: '80px' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
           Welcome to Voucher Connect Dashboard
          </Typography>
          <div>
            <Button color="inherit" onClick={openProfilePopup}>
              {profileImageURL ? (
                <img src={profileImageURL} alt="Profile" style={{ borderRadius: '50%', width: '60px', height: '60px', marginRight: '5px' }} />
              ) : (
                <AccountCircleIcon style={{ color: 'skyblue', fontSize: '45px', marginRight: '5px' }} />
              )}
              <Typography variant="h6" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {name}
              </Typography>
            </Button>
            <Popover
              open={isProfilePopupOpen}
              anchorEl={anchorEl}
              onClose={closeProfilePopup}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {/* Pass profileImageURL as a prop to UserProfile */}
              <UserProfile setProfileImageURL={setProfileImageURL} />
            </Popover>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

 
export default Navbar;