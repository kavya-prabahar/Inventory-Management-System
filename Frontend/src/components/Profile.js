import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making API calls
import '../styles/Profile.css'

const Profile = () => {
    const [organizationName, setOrganizationName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        // Fetch the organization name from the backend
        const fetchOrganizationName = async () => {
            try {
                const response = await axios.get('http://localhost:5000/get-organization-name');
                setOrganizationName(response.data.organizationName);
            } catch (error) {
                console.error('Error fetching organization name:', error);
            }
        };

        fetchOrganizationName();
    }, []);

    const handleAddUser = async () => {
        try {
            const payload = { email, password };
            await axios.post('http://localhost:5000/add-user', payload);
            alert('User added successfully');
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Error adding user');
        }
    };

    const handleSaveDetails = async () => {
        try {
            const payload = { email, password };
            await axios.post('http://localhost:5000/update-user-details', payload);
            alert('Details updated successfully');
        } catch (error) {
            console.error('Error updating details:', error);
            alert('Error updating details');
        }
    };

    return (
        <div className="profile-container">
            <div className="organization-name">
                <h3>Hey {organizationName}</h3>
            </div>
            <div className="employee-details">
                <input
                    type="email"
                    id="employee-email"
                    placeholder="Enter the mail ID of user"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    id="employee-password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className="add-user" onClick={handleAddUser}>
                    Add User
                </button>
                <button type="button" className="save-details" onClick={handleSaveDetails}>
                    Save Details
                </button>
            </div>
        </div>
    );
};

export default Profile;
