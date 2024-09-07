import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// import GetTokenUser from './GetTokenUser';

// const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl = window.REACT_APP_API_URL;

const FileItem = () => {
    const [files, setFiles] = useState([]);
    const [file, setFile] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { token, userId, fileId, isAdmin } = useContext(AuthContext);

    // GetTokenUser();

    useEffect(() => {
        const fetchUserFiles = async () => {
            const fetchUserFilesEndpoint = `${apiUrl}/api/v1/media/${userId}/`;
            try {
                const response = await axios.get(fetchUserFilesEndpoint, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });
                setFiles(response.data);
            } catch (error) {
                console.error('Error fetching user files:', error);
            }
        };

        if (files.length === 0) {
            fetchUserFiles();
        } else {
            const specificFile = files.find(f => f.id === fileId);
            setFile(specificFile);
        }
    }, [token, userId, fileId, files]);

    const handleUpdateFile = () => {
        navigate("/update-file", {state: { nameOld: file.name, descriptionOld: file.description } });
    };

    const handleUpdateFileAdmin = () => {
        navigate("/update-file-admin", {state: { nameOld: file.name, descriptionOld: file.description } });
    };

    const handleFilesList = () => {
        navigate("/files");
    };

    const handleFilesListAdmin = () => {
        navigate("/files-admin");
    };

    const handleDeleteFile = () => {
        navigate("/delete-file");
    };

    const handleDeleteFileAdmin = () => {
        navigate("/delete-file-admin");
    };

    const handleDownloadFile = () => {
        navigate("/download");
    };

    const handleLogout = () => {
        navigate("/logout-user");
    };

    const handleClickLink = async (currentId, link) => {
        window.open(link, '_blank'); // Открыть ссылку в новой вкладке
        await handleUpdateFileDate(currentId);
    };

    const handleUpdateFileDate = async (currentId) => {
        const new_date = new Date().toLocaleString();
        const updateFileDateEndpoint = `${apiUrl}/api/v1/update-file-admin/${currentId}/`;
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
            // Обновление состояния файла после успешного обновления данных
            const updatedFile = { ...file, download_date: new_date };
            setFile(updatedFile);
        } catch (error) {
            console.error('Error updating file:', error);
        }
    };

    const handleCopyLinkFile = () => {
        const downloadLinkEndpoint = `${apiUrl}/api/v1/download/${fileId}/`;
        const downloadLink = downloadLinkEndpoint;
        const textArea = document.createElement('textarea');
        textArea.value = downloadLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        alert('Download link copied to clipboard!');
    };

    return (
        <div>
            <h2>User File Details</h2>
            {file && (
                <ul>
                    <li>id: {file.id}</li>
                    <li>name: {file.name}</li>
                    <li>description: {file.description}</li>
                    <li>size: {file.size} bytes</li>
                    <li>upload_date: {file.upload_date}</li>
                    <li>download_date: {file.download_date}</li>
                    <li>download_link: <a href="#" onClick={() => handleClickLink(file.id, file.download_link)}> {file.download_link}</a></li>
                </ul>
            )}
            <ul>
                {isAdmin ? <button onClick={handleFilesListAdmin}>User Files List</button> : <button onClick={handleFilesList}>User Files List</button>}
                {isAdmin ? <button onClick={handleUpdateFileAdmin}>Update File</button> : <button onClick={handleUpdateFile}>Update File</button>}
                {isAdmin ? <button onClick={handleDeleteFileAdmin}>Delete File</button> : <button onClick={handleDeleteFile}>Delete File</button>}
                <button onClick={handleDownloadFile}>Download File</button>
                <button onClick={handleCopyLinkFile}>Copy Link File</button>
                <button onClick={handleLogout}>Logout</button>
            </ul>
        </div>
    );
};

export default FileItem;

// const FileItem = () => {
//     const [files, setFiles] = useState([]);
//     const [file, setFile] = useState(null);
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { token, userId, fileId } = useContext(AuthContext);

//     useEffect(() => {
//         const fetchUserFiles = async () => {
//             try {
//                 const response = await axios.get(`http://127.0.0.1:8000/api/v1/media/${userId}/`, {
//                     headers: {
//                         Authorization: `Token ${token}`
//                     }
//                 });
//                 setFiles(response.data);
//                 console.log('Token:', token);
//                 console.log('User ID:', userId);
//                 console.log('User Files:', response.data);
//             } catch (error) {
//                 console.error('Error fetching user files:', error);
//             }
//         };

//         if (files.length === 0) {
//             fetchUserFiles();
//         } else {
//             const specificFile = files.find(f => f.id === fileId);
//             setFile(specificFile);
//         }
//     }, [token, userId, fileId, files]);

//     const handleTestClick = () => {
//         navigate("/test");
//     };

//     const handleUpdateFile = () => {
//         navigate("/update", {state: { nameOld: file.name, descriptionOld: file.description } });
//     };

//     const handleFilesList = () => {
//         navigate("/files");
//     };

//     const handleDeleteFile = () => {
//         navigate("/delete");
//     };

//     const handleDownloadFile = () => {
//         navigate("/download");
//     };

//     const handleCopyLinkFile = () => {
//         navigate("/download");
//     };
    

//     return (
//         <div>
//             <h2>User File Details</h2>
//             {file && (
//                 <ul>
//                     <li>id: {file.id}</li>
//                     <li>name: {file.name}</li>
//                     <li>description: {file.description}</li>
//                     <li>size: {file.size} bytes</li>
//                     <li>upload_date: {file.upload_date}</li>
//                     <li>download_date: {file.download_date}</li>
//                 </ul>
//             )}
//             <ul>
//                 <li><NavLink to="/">About</NavLink></li>
//                 <button onClick={handleTestClick}>Test</button>
//                 <button onClick={handleFilesList}>User Files List</button>
//                 <button onClick={handleUpdateFile}>Update File</button>
//                 <button onClick={handleDeleteFile}>Delete File</button>
//                 <button onClick={handleDownloadFile}>Download File</button>
//                 <button onClick={handleCopyLinkFile}>Copy Link File</button>
//             </ul>
//         </div>
//     );
// };

// export default FileItem;