import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
 
const UserProfile = ({ setProfileImageURL }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageURL, setImageURL] = useState(null);
    const [error, setError] = useState(null);
    const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false); // New state
    const obj = localStorage.getItem("userInfo");
    const { username, name ,roles,mentorEmail} = JSON.parse(obj);
    const navigate = useNavigate();
    useEffect(() => {
      const fetchImageURL = async () => {
          try {
              const response = await axios.get(`http://localhost:9092/user/getProfileImageURL/${username}`, {
                  responseType: 'arraybuffer',
              });
 
              const blob = new Blob([response.data], { type: 'image/jpeg' });
              const reader = new FileReader();
 
              reader.onloadend = () => {
                setImageURL(reader.result);
                console.log('Fetched image URL:', reader.result);
                setProfileImageURL(reader.result); // Pass the imageURL to the parent component
              };
 
              reader.readAsDataURL(blob);
          } catch (error) {
              console.error('Error fetching image URL:', error.message);
              setError(error.message);
          }
      };
 
      fetchImageURL();
  }, [username]);
 
    const handleLogout = () => {
        // Open the logout confirmation dialog
        setIsLogoutConfirmationOpen(true);
    };
 
    const confirmLogout = () => {
        // Perform the logout action
        localStorage.removeItem('userInfo');
        localStorage.removeItem('id');
        console.log("Logged out...");
        navigate('/');
    };
 
    const cancelLogout = () => {
        // Close the logout confirmation dialog
        setIsLogoutConfirmationOpen(false);
    };
 
    const handleCameraIconClick = () => {
        setIsModalOpen(true);
    };
 
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
 
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
 
        const formData = new FormData();
        formData.append('image', file);
 
        try {
            const response = await axios.post(`http://localhost:9092/user/uploadProfileImage/${username}`, formData);
            console.log('File uploaded successfully:', response.data);
            setImageURL(response.data);
            handleCloseModal();
        } catch (error) {
            console.error('Error uploading file:', error.message);
        }
    };
    const acceptedFileFormats = ['.jpeg','jpg','png'];
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            {imageURL ? (
                <Avatar
                    alt="Profile"
                    src={imageURL}
                    style={{ width: '100px', height: '100px', marginBottom: '10px', marginLeft: 'auto', marginRight: 'auto' }}
                    onClick={() => setIsModalOpen(true)}
                />
            ) : (
                <Avatar
                    alt="Profile"
                    style={{ width: '100px', height: '100px', marginBottom: '10px', marginLeft: 'auto', marginRight: 'auto' }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <CameraAltIcon style={{ fontSize: 40 }} />
                </Avatar>
            )}
           
           <p style={{ marginBottom: '5px', fontSize: '18px', fontWeight: 'bold' }}>Name: {name}</p>
      <p style={{ marginBottom: '5px', fontSize: '16px' }}>Email: {username}</p>
            {/* Display mentor's email if the user is a candidate */}
            {roles.includes('ROLE_CANDIDATE') && <p>Mentor Email: {mentorEmail}</p>}
            <Button variant="outlined" color="primary" onClick={handleLogout}>
                Logout
            </Button>
             {/* Logout Confirmation Dialog */}
             <Dialog open={isLogoutConfirmationOpen} onClose={cancelLogout}>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    Are you sure you want to log out?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelLogout} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmLogout} color="primary">
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
 
            {/* Modal for File Upload */}
            <Dialog open={isModalOpen} onClose={handleCloseModal}>
                <DialogTitle>Upload Profile Image</DialogTitle>
                <DialogContent>
                    <input type="file" accept="image/*" onChange={handleFileUpload} />
                </DialogContent>
                <span style={{marginLeft:"22px",marginTop:"-20px",}}>
            Accepted formats: {acceptedFileFormats.join(', ')}
          </span>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleFileUpload} color="primary">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
 
export default UserProfile;