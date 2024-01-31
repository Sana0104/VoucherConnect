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
    const obj = localStorage.getItem("userInfo");
    const { username, name } = JSON.parse(obj);
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
        localStorage.removeItem('userInfo');
        localStorage.removeItem('id');
        console.log("Logged out...");
        navigate('/');
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
 
            <h2>User Profile</h2>
            <p>Name: {name}</p>
            <p>Email: {username}</p>
            <Button variant="outlined" color="primary" onClick={handleLogout}>
                Logout
            </Button>
 
            {/* Modal for File Upload */}
            <Dialog open={isModalOpen} onClose={handleCloseModal}>
                <DialogTitle>Upload Profile Image</DialogTitle>
                <DialogContent>
                    <input type="file" accept="image/*" onChange={handleFileUpload} />
                </DialogContent>
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