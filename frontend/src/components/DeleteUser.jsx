import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl = window.REACT_APP_API_URL;

const DeleteUser = () => {
    const navigate = useNavigate();
    const { token, userId, isAdmin, logoutUser } = useContext(AuthContext);
    const handleDeleteUser = async () => {
        const deleteUserEndpoint = `${apiUrl}/api/v1/delete-user/${userId}/`;
        try {
            await axios.delete(deleteUserEndpoint, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            console.log(`User with ID ${userId} deleted successfully.`);
            logoutUser();
            navigate("/");
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleUnDeleteUser = () => {
        navigate("/user");
    };

    const handleLogout = () => {
        navigate("/logout");
    };

    const handleLogoutUser = () => {
        navigate("/logout-user");
    };

    return (
        <div>
            <div>Are you sure you want to delete this user?</div>
            <button onClick={handleDeleteUser}>Ok</button>
            <button onClick={handleUnDeleteUser}>No</button>
            {isAdmin ? <button onClick={handleLogout}>Logout</button> : <button onClick={handleLogoutUser}>Logout</button>}
        </div>
    );
};

export default DeleteUser;
