import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl = window.REACT_APP_API_URL;

const DeleteFileAdmin = () => {
    const navigate = useNavigate();
    const { token, fileId } = useContext(AuthContext);
    
    const handleDeleteFile = async () => {
        const deleteFileEndpoint = `${apiUrl}/api/v1/delete-file-admin/${fileId}/`;
        try {
            await axios.delete(deleteFileEndpoint, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            console.log(`File with ID ${fileId} deleted successfully.`);
            navigate("/files-admin");
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const handleUnDeleteFile = () => {
        navigate("/user-file");
    };

    const handleLogout = () => {
        navigate("/logout-user");
    };

    return (
        <div>
            <div>Are you sure you want to delete this file?</div>
            <button onClick={handleDeleteFile}>Yes</button>
            <button onClick={handleUnDeleteFile}>No</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default DeleteFileAdmin;
