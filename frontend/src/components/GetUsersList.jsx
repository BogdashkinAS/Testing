import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl = window.REACT_APP_API_URL;

const GetUsersList = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { token, userId, setUserId, isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();
    console.log('Token', token);

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchUsersEndpoint = `${apiUrl}/api/v1/alluser/`;
            try {
                const response = await axios.get(fetchUsersEndpoint, {
                    headers: {
                        Authorization: `Token ${token}` 
                    }
                });
                setUsers(response.data);
                setIsLoading(false);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setIsLoading(false);
            }
        };

        if (isLoading) {
            fetchUsers();
        }
    }, [isLoading, token]);

    const handleLogout = () => {
        navigate("/logout");
    };

    const handleLogoutUser = () => {
        navigate("/logout-user");
    };

    const handleUserClick = (userId) => {
        setUserId(userId);
        navigate("/user");
    };

    
    return (
        <div>
            <h1>Users List</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {users.map(user => (
                        <li key={user.id}>
                            <a href="#" onClick={() => handleUserClick(user.id)}>id: {user.id}</a>, name: {user.username}, fullname: {user.first_name}, email: {user.email}, admin: {user.is_superuser ? 'true' : 'false'}
                        </li>
                    ))}
                </ul>
            )}
            {isAdmin ? <button onClick={handleLogout}>Logout</button> : <button onClick={handleLogoutUser}>Logout</button>}
        </div>
    );
};

export default GetUsersList;

// import React, { useEffect, useState, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const GetUserList = () => {
//     const [users, setUsers] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const { token, userId, setUserId } = useContext(AuthContext);
//     const navigate = useNavigate();
//     console.log('Token', token);

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

//         if (isLoading) { // Перенесено внутрь useEffect
//             fetchUsers();
//         }
//     }, [isLoading, token]); // Добавление token устранит предупреждение о его отсутствии в зависимостях, но может быть ненужным при статическом токене

//     return (
//         <div>
//             <h1>User List</h1>
//             {isLoading ? (
//                 <p>Loading...</p>
//             ) : (
//                 <ul>
//                     {users.map(user => (
//                         <li key={user.id}>
//                             id: {user.id}, name: {user.username}, fullname: {user.first_name}, email: {user.email}, admin: {user.is_superuser ? 'true' : 'false'}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default GetUserList;