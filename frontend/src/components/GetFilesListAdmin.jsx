import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl = window.REACT_APP_API_URL;

const GetFilesListAdmin = () => {
    const [files, setFiles] = useState([]);
    const [stateUser, setStateUser] = useState();
    const navigate = useNavigate();
    const { token, userId, setFileId, isAdmin } = useContext(AuthContext);

    useEffect(() => {
        const fetchUserFiles = async () => {
            const userFilesEndpoint = `${apiUrl}/api/v1/media/${userId}/`;
            try {
                const response = await axios.get(userFilesEndpoint, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });
                setFiles(response.data);
                console.log('Token:', token);
                console.log('ID:', userId);
                console.log('User files:', response.data);
            } catch (error) {
                console.error('Error fetching user files:', error);
            }
        };

        fetchUserFiles();
        userIdToken();
        if (userId === stateUser) {
            console.log('This admin folder!');
        } else {
            console.log('This folder is not an admin folder!');
        }
    }, [token, userId]);

    const userIdToken = async () => {
        const userIdTokenEndpoint = `${apiUrl}/api/v1/get-token-user-id/`;
        try {
            const response = await axios.get(userIdTokenEndpoint, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            const currentIdUser = response.data.user_id;
            setStateUser(currentIdUser);
            console.log('currentIdUser:', currentIdUser);
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    const handleFileClick = (fileId) => {
        setFileId(fileId);
        navigate("/user-file");
    };

    const handleLogout = () => {
        navigate("/logout");
    };

    const handleLogoutUser = () => {
        navigate("/logout-user");
    };

    const handleUsersList = () => {
        navigate("/users");
    };

    const handleClickLink = async (currentId, link) => {
        window.open(link, '_blank'); // Открыть ссылку в новой вкладке
        await handleUpdateFile(currentId);
    };

    const handleUserClick = () => {
        navigate("/user");
    };

    const handleUploadClick = () => {
        navigate("/upload");
    };

    const handleUpdateFile = async (currentId) => {
        const updateFileEndpoint = `${apiUrl}/api/v1/update-file-admin/${currentId}/`;
        const newDateStr = new Date().toLocaleString(); 
        try {
            await axios.patch(updateFileEndpoint, {
                download_date: newDateStr
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Token ${token}`
                }
            });
            console.log(`New date ${newDateStr} updated successfully.`);
            const updatedFiles = files.map(file => {
                if (file.id === currentId) {
                    return {
                        ...file,
                        download_date: newDateStr
                    };
                }
                return file;
            });
            setFiles(updatedFiles);
        } catch (error) {
            console.error('Error updating file:', error);
        }
    };

    return (
        <div>
            <h2>User Files List</h2>
            <ul>
                {files.map(file => (
                    <li key={file.id}>
                        <a href="#" onClick={() => handleFileClick(file.id)}>id: {file.id}</a> | name: {file.name} | description: {file.description} | 
                        size: {file.size} bytes | upload_date: {file.upload_date} | download_date: {file.download_date} | download_link: 
                        <a href="#" onClick={() => handleClickLink(file.id, file.download_link)}> {file.download_link}</a>
                    </li>
                ))}
            </ul>
            {userId === stateUser && <button onClick={handleUploadClick}>Upload new file</button>}
            <button onClick={handleUsersList}>Users List</button>
            <button onClick={handleUserClick}>User List</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default GetFilesListAdmin;