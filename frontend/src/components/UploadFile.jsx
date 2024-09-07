import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl = window.REACT_APP_API_URL;

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const { token, userId, isAdmin } = useContext(AuthContext);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleUpdateFile = async (currentId, downloadLink) => {
        const updateFileEndpoint = `${apiUrl}/api/v1/update-file/${currentId}/`;
        try {
            await axios.patch(updateFileEndpoint, {
                download_link: downloadLink
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Token ${token}`
                }
            });
            console.log(`File with ID ${currentId} updated successfully.`);
            if(!isAdmin) {
                navigate('/files');
            } else {
                navigate('/files-admin');
            }
        } catch (error) {
            console.error('Error updating file:', error);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);
        formData.append('user', userId);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Token ${token}`,
                },
            };

            const formDataEndpoint = `${apiUrl}/api/v1/upload-file/`;
            const response = await axios.post(formDataEndpoint, formData, config);
            console.log('File uploaded successfully:', response.data);

            const currentId = response.data.id; // Получить id загруженного файла из ответа
            const downloadLinkEndpoint = `${apiUrl}/api/v1/download/${currentId}/`;
            const downloadLink = downloadLinkEndpoint;
            handleUpdateFile(currentId, downloadLink);
            console.log('Download link: ', downloadLink);
            console.log('Download link updated successfully.');
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleFilesList = () => {
        if(!isAdmin) {
            navigate('/files');
        } else {
            navigate('/files-admin');
        }
        
    };

    return (
        <div>
            <input type='file' onChange={handleFileChange} />
            <input type='text' placeholder='Description' value={description} onChange={handleDescriptionChange} />
            <button onClick={handleSubmit}>OK</button>
            <button onClick={handleFilesList}>User Files List</button>
        </div>
    );
};

export default UploadFile;
