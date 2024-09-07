import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl = window.REACT_APP_API_URL;

const DownloadFile = () => {
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const { token, fileId } = useContext(AuthContext);

    const handleDownloadFile = () => {
        const urlEndpoint = `${apiUrl}/api/v1/download/${fileId}/`;
        const url = urlEndpoint;
        window.location.href = url; // Перенаправляем на URL, вызывая загрузку файла в текущей вкладке
        console.log(`File with ID ${fileId} download started.`);
        handleUpdateFileDate();
    };

        const handleUpdateFileDate = async () => {
            const new_date = new Date().toLocaleString();
            const updateFileDateEndpoint = `${apiUrl}/api/v1/update-file-admin/${fileId}/`;
            try {
                await axios.patch(updateFileDateEndpoint, {
                    download_date: new_date
                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Token ${token}`
                    }
                });
                console.log(`New date ${new_date} updated successfully.`);
                navigate("/user-file");
            } catch (error) {
                console.error('Error updating file:', error);
            }
        };

    const handleBackFileItem = () => {
        navigate("/user-file");
    };

    const handleLogout = () => {
        navigate("/logout-user");
    };

    return (
        <div>
            <div>Are you sure you want to download this file?</div>
            <button onClick={handleDownloadFile}>Yes</button>
            <button onClick={handleBackFileItem}>No</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default DownloadFile;
