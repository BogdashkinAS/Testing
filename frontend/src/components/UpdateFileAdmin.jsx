import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl = window.REACT_APP_API_URL;

const UpdateFileAdmin = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const location = useLocation();
    const { nameOld, descriptionOld } = location.state;
    const navigate = useNavigate();
    const { token, fileId } = useContext(AuthContext);

    useEffect(() => {
        if (nameOld && descriptionOld) {
            // Используем строковые методы для удаления расширения из имени файла, если оно есть
            const nameWithoutExtension = nameOld.substring(0, nameOld.lastIndexOf('.')) || nameOld;
            // Устанавливаем nameWithoutExtension в состояние name
            setName(nameWithoutExtension);
            // Устанавливаем значение описания файла в состояние description
            setDescription(descriptionOld);
        }
    }, [nameOld, descriptionOld]);

    const handleUpdateFile = async () => {
        const updateFileEndpoint = `${apiUrl}/api/v1/update-file-admin/${fileId}/`;
        try {
            await axios.patch(updateFileEndpoint, {
                name: name,
                description: description
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Token ${token}`
                }
            });
            console.log(`File with ID ${fileId} updated successfully.`);
            navigate("/user-file");
        } catch (error) {
            console.error('Error updating file:', error);
        }
    };

    const handleFilesList = () => {
        navigate("/files-admin");
    };

    const handleLogout = () => {
        navigate("/logout-user");
    };

    // const handleStateList = () => {
    //     console.log("NameOld: ", nameOld);
    //     console.log("DescriptionOld: ", descriptionOld);
    // };

    return (
        <div>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <button onClick={handleUpdateFile}>OK</button>
            <button onClick={handleFilesList}>User Files List</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default UpdateFileAdmin;