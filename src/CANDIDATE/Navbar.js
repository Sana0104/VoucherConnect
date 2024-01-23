import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import UserProfile from './UserProfile';
import Popover from '@mui/material/Popover';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useProfileImage } from './ProfileImageContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { imageURL, resetImage } = useProfileImage();
  const [userChanged, setUserChanged] = useState(false);

  const openProfilePopup = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeProfilePopup = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    // Assuming there is a login logic that triggers when the user logs in
    // After a successful login, set userChanged to true to trigger the immediate update of the profile image
    setUserChanged(true);
  };

  const isProfilePopupOpen = Boolean(anchorEl);

  const obj = localStorage.getItem('userInfo');
  const { name } = JSON.parse(obj);

  // Reset userChanged after the image is fetched
  const handleImageLoad = () => {
    setUserChanged(false);
  };

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: 'black', height: '80px' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            Welcome to Voucher Connect Dashboard
          </Typography>
          <div>
            <Button color="inherit" onClick={openProfilePopup} onMouseEnter={handleLogin}>
              {imageURL ? (
                <Avatar
                  alt="Profile"
                  src={imageURL}
                  style={{ width: '63px', height: '63px', marginRight: '8px', marginBottom: '3px' }}
                  onLoad={handleImageLoad} // Reset userChanged after the image is loaded
                />
              ) : (
                <AccountCircleIcon style={{ color: 'skyblue', fontSize: '32px', marginRight: '8px' }} />
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
              <UserProfile userChanged={userChanged} />
            </Popover>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
