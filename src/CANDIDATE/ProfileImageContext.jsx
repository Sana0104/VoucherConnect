// In your ProfileImageContext.js or wherever useProfileImage is defined
import React, { createContext, useContext, useState } from 'react';

const ProfileImageContext = createContext();

export const ProfileImageProvider = ({ children }) => {
  const [imageURL, setImageURL] = useState(null);

  const resetImage = () => {
    // Reset the image URL to null or any default value
    setImageURL(null);
  };

  return (
    <ProfileImageContext.Provider value={{ imageURL, setImageURL, resetImage }}>
      {children}
    </ProfileImageContext.Provider>
  );
};

export const useProfileImage = () => {
  const context = useContext(ProfileImageContext);
  if (!context) {
    throw new Error('useProfileImage must be used within a ProfileImageProvider');
  }
  return context;
};
