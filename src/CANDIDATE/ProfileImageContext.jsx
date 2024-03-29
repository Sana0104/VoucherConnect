import { createContext, useContext, useState } from 'react';

const ProfileImageContext = createContext();

export const ProfileImageProvider = ({ children }) => {
  const [imageURL, setImageURL] = useState(null);

  return (
    <ProfileImageContext.Provider value={{ imageURL, setImageURL }}>
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
