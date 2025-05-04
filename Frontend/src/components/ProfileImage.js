import React, { useState } from 'react';  
import imageSrc from '../images/output-onlinetools.png';
import '../styles/ProfileImage.css';
import axios from 'axios';

const ProfileImage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [userDetails, setUserDetails] = useState({ email: '', organization: '' });

  const handleMouseEnter = async () => {
    setIsHovered(true);
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    try {
      const response = await axios.get(`http://localhost:5000/user-details?email=${userEmail}`, {
        withCredentials: true,
      });

      if (response.data && response.data.organization) {
        console.log('Fetched user details:', response.data); // ✅ log when hover triggers fetch
        setUserDetails({
          email: userEmail,
          organization: response.data.organization,
        });
      } else {
        console.warn('Organization not found for user');
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error.response?.data || error.message);
    }
  };

  return (
    <div 
      className="profile-container" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img className="image-profile" src={imageSrc} alt="user profile" />
      {isHovered && (
        <div className="profile-popup">
          <p><strong>Organization:</strong> {userDetails.organization}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
