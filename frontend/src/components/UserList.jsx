import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl = window.REACT_APP_API_URL;

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { token, userId, setUserId, isAdmin, setIsAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

    const [totalFiles, setTotalFiles] = useState(0);
    const [totalSize, setTotalSize] = useState(0);

    const fetchUsers = async () => {
        const fetchUserEndpoint = `${apiUrl}/api/v1/alluser/`;
        try {
            const response = await axios.get(fetchUserEndpoint, {
                headers: { Authorization: `Token ${token}` }
            });
            setUsers(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setIsLoading(false);
        }
    };

    const fetchUserFiles = async () => {
        const fetchUserFilesEndpoint = `${apiUrl}/api/v1/media/${userId}/`;
        try {
            const response = await axios.get(fetchUserFilesEndpoint, {
                headers: { Authorization: `Token ${token}` }
            });
    
            const data = response.data;
            const totalFiles = data.length;
    
            const totalSize = data.reduce((acc, file) => acc + parseInt(file.size), 0); 
    
            setTotalFiles(totalFiles);
            setTotalSize(totalSize);
        } catch (error) {
            console.error('Error fetching user files:', error);
        }
    };

    useEffect(() => {
        if (isLoading) {
            fetchUsers();
        } else {
            const specificUser = users.find(u => u.id === userId);
            setUser(specificUser);
            fetchUserFiles();
        }
    }, [isLoading, token, userId, users]); 

    const handleUsersList = () => {
        navigate('/users');
    };

    const handleUserFilesList = () => {
        setUserId(user.id);
        navigate('/files-admin');
    };

    const handleLogout = () => {
        navigate('/logout');
    };

    const handleLogoutUser = () => {
        navigate('/logout-user');
    };

    const handleUserDelete = () => {
        navigate('/delete-user');
    };

    const toggleAdminStatus = async () => {
        const toggleAdminStatusEndpoint = `${apiUrl}/api/v1/toggle-admin/${user.id}/`;
        try {
            if (user.id === 1) {
                console.log('The main server administrator cannot revoke their own admin status.');
                return;
            }
    
            const response = await axios.put(toggleAdminStatusEndpoint, {}, {
                headers: { Authorization: `Token ${token}` }
            });
    
            // setIsAdmin(!user.is_superuser); // Toggle isAdmin
            // You may want to refetch users or perform other actions after changing admin status
            fetchUsers();
        } catch (error) {
            console.error('Error updating user admin status:', error);
        }
    };

    // const toggleAdminStatus = async () => {
    //     try {
    //         const response = await axios.put(`http://127.0.0.1:8000/api/v1/toggle-admin/${user.id}/`, {}, {
    //             headers: {
    //                 Authorization: `Token ${token}`
    //             }
    //         });
    //         // setIsAdmin(!user.is_superuser); // Toggle isAdmin
    //         // You may want to refetch users or perform other actions after changing admin status
    //         fetchUsers();
    //     } catch (error) {
    //         console.error('Error updating user admin status:', error);
    //     }
    // };

    return (
        <div>
            <h1>User List</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : user && (
                <div>
                    <ul>
                        <li>id: {user.id}</li>
                        <li>name: {user.username}</li>
                        <li>fullname: {user.first_name}</li>
                        <li>email: {user.email}</li>
                        <li>admin: {user.is_superuser ? 'true' : 'false'}</li>
                    </ul>
                    <p>Total Files: {totalFiles}</p>
                    <p>Total Size: {totalSize} bytes</p>
                </div>
            )}
            <ul>
                <button onClick={handleUsersList}>Users List</button>
                <button onClick={handleUserFilesList}>User Files List</button>
                <button onClick={toggleAdminStatus}>Toggle Admin Status</button>
                <button onClick={handleUserDelete}>Delete User</button>
                {isAdmin ? <button onClick={handleLogout}>Logout</button> : <button onClick={handleLogoutUser}>Logout</button>}
            </ul>
        </div>
    );
};

export default UserList;

// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';

// const UserList = () => {
//     const [users, setUsers] = useState([]);
//     const [user, setUser] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const { token, userId, setUserId, isAdmin, setIsAdmin } = useContext(AuthContext);
//     const navigate = useNavigate();

//     const [totalFiles, setTotalFiles] = useState(0);
//     const [totalSize, setTotalSize] = useState(0);

//     // Объявляем fetchUsers за пределами useEffect
//     const fetchUsers = async () => {
//         try {
//             const response = await axios.get('http://127.0.0.1:8000/api/v1/alluser/', {
//                 headers: {
//                     Authorization: `Token ${token}` // Исправленная строка с использованием шаблонной строки
//                 }
//             });
//             setUsers(response.data);
//             setIsLoading(false);
//         } catch (error) {
//             console.error('Error fetching users:', error);
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (isLoading) {
//             fetchUsers();
//         } else {
//             const specificUser = users.find(u => u.id === userId);
//             setUser(specificUser);
            
//             // Объявляем fetchUserFiles внутри useEffect или за его пределами, аналогично fetchUsers
//             const fetchUserFiles = async () => {
//                 try {
//                     const response = await axios.get(`http://127.0.0.1:8000/api/v1/media/${userId}/`, {
//                         headers: {
//                             Authorization: `Token ${token}`
//                         }
//                     });
//                     const data = response.data;
//                     setTotalFiles(data.length);
//                     const totalSize = data.reduce((acc, file) => acc + file.size, 0);
//                     setTotalSize(totalSize);
//                 } catch (error) {
//                     console.error('Error fetching user files:', error);
//                 }
//             };

//             fetchUserFiles();
//         }
//     }, [isLoading, token, userId, users, user]); // Проверьте, действительно ли все эти зависимости необходимы; возможно, user здесь избыточен

//     const handleUsersList = () => {
//         navigate('/users');
//     };

//     const handleUserFilesList = () => {
//         setUserId(user.id);
//         navigate('/files-admin');
//     };

//     const handleLogout = () => {
//         navigate('/logout');
//     };

//     const handleLogoutUser = () => {
//         navigate('/logout-user');
//     };

//     const handleUserDelete = () => {
//         navigate('/delete-user');
//     };

//     const toggleAdminStatus = async () => {
//         try {
//             const response = await axios.put(`http://127.0.0.1:8000/api/v1/toggle-admin/${user.id}/`, {}, {
//                 headers: {
//                     Authorization: `Token ${token}`
//                 }
//             });
//             // setIsAdmin(!user.is_superuser); // Toggle isAdmin
//             // You may want to refetch users or perform other actions after changing admin status
//             fetchUsers();
//         } catch (error) {
//             console.error('Error updating user admin status:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>User List</h1>
//             {isLoading ? (
//                 <p>Loading...</p>
//             ) : user && (
//                 <div>
//                     <ul>
//                         <li>id: {user.id}</li>
//                         <li>name: {user.username}</li>
//                         <li>fullname: {user.first_name}</li>
//                         <li>email: {user.email}</li>
//                         <li>admin: {user.is_superuser ? 'true' : 'false'}</li>
//                     </ul>
//                     <p>Total Files: {totalFiles}</p>
//                     <p>Total Size: {totalSize} bytes</p>
//                 </div>
//             )}
//             <ul>
//                 <button onClick={handleUsersList}>Users List</button>
//                 <button onClick={handleUserFilesList}>User Files List</button>
//                 <button onClick={toggleAdminStatus}>Toggle Admin Status</button>
//                 <button onClick={handleUserDelete}>Delete User</button>
//                 {isAdmin ? <button onClick={handleLogout}>Logout</button> : <button onClick={handleLogoutUser}>Logout</button>}
//             </ul>
//         </div>
//     );
// };

// export default UserList;


























// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';

// const UserList = () => {
//     const [users, setUsers] = useState([]);
//     const [user, setUser] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const { token, userId, setUserId, isAdmin, setIsAdmin } = useContext(AuthContext);
//     const navigate = useNavigate();
//     const [totalFiles, setTotalFiles] = useState(0);
//     const [totalSize, setTotalSize] = useState(0);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:8000/api/v1/alluser/', {
//                     headers: {
//                         Authorization: `Token ${token}`
//                     }
//                 });
//                 setUsers(response.data);
//                 setIsLoading(false);
//             } catch (error) {
//                 console.error('Error fetching users:', error);
//                 setIsLoading(false);
//             }
//         };

//         const fetchUserFiles = async () => {
//             try {
//                 const response = await axios.get(`http://127.0.0.1:8000/api/v1/media/${userId}/`, {
//                     headers: {
//                         Authorization: `Token ${token}`
//                     }
//                 });
//                 const data = response.data;
//                 setTotalFiles(data.length);
//                 const totalSize = data.reduce((acc, file) => acc + file.size, 0);
//                 setTotalSize(totalSize);
//             } catch (error) {
//                 console.error('Error fetching user files:', error);
//             }
//         };

//         if (isLoading) {
//             fetchUsers();
//         } else {
//             const specificUser = users.find(u => u.id === userId);
//             setUser(specificUser);
//             fetchUserFiles();
//         }
//     }, [isLoading, token, userId, users, user]); // Add userId as a dependency

//     const handleUsersList = () => {
//         navigate('/users');
//     };

//     const handleUserFilesList = () => {
//         setUserId(user.id);
//         navigate('/files');
//     };

//     const handleLogout = () => {
//         navigate('/logout');
//     };

//     const handleLogoutUser = () => {
//         navigate('/logout-user');
//     };

//     const handleUserDelete = () => {
//         navigate('/delete-user');
//     };

//     const toggleAdminStatus = async () => {
//         try {
//             const response = await axios.put(`http://127.0.0.1:8000/api/v1/toggle-admin/${user.id}/`, {}, {
//                 headers: {
//                     Authorization: `Token ${token}`
//                 }
//             });
//             setIsAdmin(!user.is_superuser); // Toggle isAdmin
//             // You may want to refetch users or perform other actions after changing admin status
//             fetchUsers();
//         } catch (error) {
//             console.error('Error updating user admin status:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>User List</h1>
//             {isLoading ? (
//                 <p>Loading...</p>
//             ) : user && (
//                 <div>
//                     <ul>
//                         <li>id: {user.id}</li>
//                         <li>name: {user.username}</li>
//                         <li>fullname: {user.first_name}</li>
//                         <li>email: {user.email}</li>
//                         <li>admin: {user.is_superuser ? 'true' : 'false'}</li>
//                     </ul>
//                     <p>Total Files: {totalFiles}</p>
//                     <p>Total Size: {totalSize} bytes</p>
//                 </div>
//             )}
//             <ul>
//                 <button onClick={handleUsersList}>Users List</button>
//                 <button onClick={handleUserFilesList}>User Files List</button>
//                 <button onClick={toggleAdminStatus}>Toggle Admin Status</button>
//                 <button onClick={handleUserDelete}>Delete User</button>
//                 {isAdmin ? <button onClick={handleLogout}>Logout</button> : <button onClick={handleLogoutUser}>Logout</button>}
//             </ul>
//         </div>
//     );
// };

// export default UserList;





















































// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

// const UserList = () => {
//     const [users, setUsers] = useState([]);
//     const [user, setUser] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const { token, userId, setUserId, isAdmin, setIsAdmin } = useContext(AuthContext);
//     const navigate = useNavigate();
//     const [totalFiles, setTotalFiles] = useState(0);
//     const [totalSize, setTotalSize] = useState(0);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:8000/api/v1/alluser/', {
//                     headers: {
//                         Authorization: `Token ${token}`
//                     }
//                 });
//                 setUsers(response.data);
//                 setIsLoading(false);
//                 console.log(response.data);
//             } catch (error) {
//                 console.error('Error fetching users:', error);
//                 setIsLoading(false);
//             }
//         };

//         const fetchUserFiles = async () => {
//             try {
//                 const response = await axios.get(`http://127.0.0.1:8000/api/v1/media/${userId}/`, {
//                     headers: {
//                         Authorization: `Token ${token}`
//                     }
//                 });
//                 const data = response.data;
//                 setTotalFiles(data.length);
//                 const totalSize = data.reduce((acc, file) => acc + file.size, 0);
//                 setTotalSize(totalSize);
//             } catch (error) {
//                 console.error('Error fetching user files:', error);
//             }
//         };

//         if (isLoading) {
//             fetchUsers();
//         } else {
//             const specificUser = users.find(u => u.id === userId);
//             setUser(specificUser);
//             fetchUserFiles();
//         }
//     }, [isLoading, token, userId, users, user, token]); // Add user and token as dependencies

//     const handleUsersList = () => {
//         navigate('/users');
//     };

//     const handleUserFilesList = () => {
//         setUserId(user.id);
//         navigate('/files');
//     };

//     const handleLogout = () => {
//         navigate('/logout');
//     };

//     const handleLogoutUser = () => {
//         navigate('/logout-user');
//     };

//     const handleUserDelete = () => {
//         navigate('/delete-user');
//     };

//     const toggleAdminStatus = async () => {
//         try {
//             console.log('user.id: ', user.id);
//             console.log('token: ', token);
//             const response = await axios.put(`http://127.0.0.1:8000/api/v1/toggle-admin/${user.id}/`, {}, {
//                 headers: {
//                     Authorization: `Token ${token}`
//                 }
//             });
//             console.log('user.id: ', user.id);
//             console.log('token: ', token);
//             // You may want to refetch users or perform other actions after changing admin status
//             fetchUsers();
//             // setIsAdmin(false);
//         } catch (error) {
//             console.error('Error updating user admin status:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>User List</h1>
//             {isLoading ? (
//                 <p>Loading...</p>
//             ) : user && (
//                 <div>
//                     <ul>
//                         <li>id: {user.id}</li>
//                         <li>name: {user.username}</li>
//                         <li>fullname: {user.first_name}</li>
//                         <li>email: {user.email}</li>
//                         <li>admin: {user.is_superuser ? 'true' : 'false'}</li>
//                     </ul>
//                     <p>Total Files: {totalFiles}</p>
//                     <p>Total Size: {totalSize} bytes</p>
//                 </div>
//             )}
//             <ul>
//                 <button onClick={handleUsersList}>Users List</button>
//                 <button onClick={handleUserFilesList}>User Files List</button>
//                 <button onClick={toggleAdminStatus}>Toggle Admin Status</button>
//                 <button onClick={handleUserDelete}>Delete User</button>
//                 {isAdmin ? <button onClick={handleLogout}>Logout</button> : <button onClick={handleLogoutUser}>Logout</button>}
//             </ul>
//         </div>
//     );
// };

// export default UserList;

// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

// const UserList = () => {
//     const [users, setUsers] = useState([]);
//     const [user, setUser] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const { token, userId, setUserId, isAdmin } = useContext(AuthContext);
//     const navigate = useNavigate();
//     const [totalFiles, setTotalFiles] = useState(0);
//     const [totalSize, setTotalSize] = useState(0);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:8000/api/v1/alluser/', {
//                     headers: {
//                         Authorization: `Token ${token}`
//                     }
//                 });
//                 setUsers(response.data);
//                 setIsLoading(false);
//                 console.log(response.data);
//             } catch (error) {
//                 console.error('Error fetching users:', error);
//                 setIsLoading(false);
//             }
//         };

//         const fetchUserFiles = async () => {
//             try {
//                 const response = await axios.get(`http://127.0.0.1:8000/api/v1/media/${userId}/`, {
//                     headers: {
//                         Authorization: `Token ${token}`
//                     }
//                 });
//                 const data = response.data;
//                 setTotalFiles(data.length);
//                 const totalSize = data.reduce((acc, file) => acc + file.size, 0);
//                 setTotalSize(totalSize);
//             } catch (error) {
//                 console.error('Error fetching user files:', error);
//             }
//         };

//         if (isLoading) {
//             fetchUsers();
//         } else {
//             const specificUser = users.find(u => u.id === userId);
//             setUser(specificUser);
//             fetchUserFiles();
//         }
//     }, [isLoading, token, userId, users, user, token]);

//     const handleUsersList = () => {
//         navigate('/users');
//     };

//     const handleUserFilesList = () => {
//         setUserId(user.id);
//         navigate('/files');
//     };

//     const handleLogout = () => {
//         navigate("/logout");
//     };

//     const handleLogoutUser = () => {
//         navigate("/logout-user");
//     };

//     const handleUserDelete = () => {
//         navigate("/delete-user");
//     };

//     const toggleAdminStatus = async () => {
//         try {
//             console.log('user.id: ', user.id);
//             console.log('token: ', token);
//             const response = await axios.put(`http://127.0.0.1:8000/api/v1/toggle-admin/${user.id}/`, {},  {
//                 headers: {
//                     Authorization: `Token ${token}`
//                 }
//             });
//             console.log('user.id: ', user.id);
//             console.log('token: ', token);
//         } catch (error) {
//             console.error('Error updating user admin status:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>User List</h1>
//             {isLoading ? (
//                 <p>Loading...</p>
//             ) : user && (
//                 <div>
//                     <ul>
//                         <li>id: {user.id}</li>
//                         <li>name: {user.username}</li>
//                         <li>fullname: {user.first_name}</li>
//                         <li>email: {user.email}</li>
//                         <li>admin: {user.is_superuser ? 'true' : 'false'}</li>
//                     </ul>
//                     <p>Total Files: {totalFiles}</p>
//                     <p>Total Size: {totalSize} bytes</p>
//                 </div>
//             )}
//             <ul>
//                 <button onClick={handleUsersList}>Users List</button>
//                 <button onClick={handleUserFilesList}>User Files List</button>
//                 <button onClick={toggleAdminStatus}>Toggle Admin Status</button>
//                 <button onClick={handleUserDelete}>Delete User</button>
//                 {isAdmin ? <button onClick={handleLogout}>Logout</button> : <button onClick={handleLogoutUser}>Logout</button>}
//             </ul>
//         </div>
//     );
// };

// export default UserList;

// import React, { useEffect, useState, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const UserList = () => {
//     const [users, setUsers] = useState([]);
//     const [user, setUser] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const { token, userId, setUserId } = useContext(AuthContext);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:8000/api/v1/alluser/', {
//                     headers: {
//                         Authorization: `Token ${token}`
//                     }
//                 });
//                 setUsers(response.data);
//                 setIsLoading(false);
//                 console.log(response.data);
//             } catch (error) {
//                 console.error('Error fetching users:', error);
//                 setIsLoading(false);
//             }
//         };

//         if (isLoading) {
//             fetchUsers();
//         }
//         if (users.length === 0) {
//             fetchUsers();
//         } else {
//             const specificUser = users.find(u => u.id === userId);
//             setUser(specificUser);
//         }
//     }, [isLoading, token, userId, users]);

//     const handleUsersList = () => {
//         navigate('/users');
//     };

//     const handleUserFilesList = () => {
//         setUserId(user.id);
//         navigate('/files');
//     };

//     const handleLogout = () => {
//         navigate("/logout-user");
//     };

//     const handleUserDelete = () => {
//         navigate("/delete-user");
//     };


    // const toggleAdminStatus = async () => {
    //     try {
    //         console.log('user.id: ', user.id);
    //         console.log('token: ', token);
    //         const response = await axios.put(`http://127.0.0.1:8000/api/v1/toggle-admin/${user.id}/`, {},  {
    //             headers: {
    //                 Authorization: `Token ${token}`
    //             }
    //         });
    //         console.log('user.id: ', user.id);
    //         console.log('token: ', token);
    //     } catch (error) {
    //         console.error('Error updating user admin status:', error);
    //     }
    // };

//     return (
//         <div>
//             <h1>User List</h1>
//             {isLoading ? (
//                 <p>Loading...</p>
//             ) : user && (
//                 <ul>
//                     <li>id: {user.id}</li>
//                     <li>name: {user.username}</li>
//                     <li>fullname: {user.first_name}</li>
//                     <li>email: {user.email}</li>
//                     <li>admin: {user.is_superuser ? 'true' : 'false'}</li>
//                 </ul>
//             )}
//             <ul>
//                 <button onClick={handleUsersList}>Users List</button>
//                 <button onClick={handleUserFilesList}>User Files List</button>
//                 <button onClick={toggleAdminStatus}>Toggle Admin Status</button>
//                 <button onClick={handleUserDelete}>Delete User</button>
//                 <button onClick={handleLogout}>Logout</button>
//             </ul>
//         </div>
//     );
// };

// export default UserList;

// import React, { useEffect, useState, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const UserList = () => {
//     const [users, setUsers] = useState([]);
//     const [user, setUser] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const { token, userId, setUserId } = useContext(AuthContext);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:8000/api/v1/alluser/', {
//                     headers: {
//                         Authorization: `Token ${token}`
//                     }
//                 });
//                 setUsers(response.data);
//                 setIsLoading(false);
//                 console.log(response.data);
//             } catch (error) {
//                 console.error('Error fetching users:', error);
//                 setIsLoading(false);
//             }
//         };

//         if (isLoading) {
//             fetchUsers();
//         }
//         if (users.length === 0) {
//             fetchUsers();
//         } else {
//             const specificUser = users.find(u => u.id === userId);
//             setUser(specificUser);
//         }
//     }, [isLoading, token, userId, users]);

//     const handleUsersList = () => {
//         navigate('/users');
//     };

//     const handleUserFileList = () => {
//         setUserId(user.id);
//         navigate('/files');
//     };

//     return (
//         <div>
//             <h1>User List</h1>
//             {isLoading ? (
//                 <p>Loading...</p>
//             ) : user && (
//                 <ul>
//                     <li>id: {user.id}</li>
//                     <li>name: {user.username}</li>
//                     <li>fullname: {user.first_name}</li>
//                     <li>email: {user.email}</li>
//                     <li>admin: {user.is_superuser ? 'true' : 'false'}</li>
//                 </ul>
//             )}
//             <ul>
//                 <button onClick={handleUsersList}>Users List</button>
//                 <button onClick={handleUserFileList}>User File List</button>
//             </ul>
//         </div>
//     );
// };

// export default UserList;
