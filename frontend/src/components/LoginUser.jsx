import { useNavigate } from 'react-router-dom';
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl = window.REACT_APP_API_URL;

const LoginUser = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { token, setToken, userId, setUserId, isAdmin, setIsAdmin } = useContext(AuthContext);

    const handleBackMainPage = () => {
        navigate("/");
    };
    
    const handleGetToken = async () => {
        const getTokenEndpoint = `${apiUrl}/auth/token/login/`;
        try {
            const response = await axios.post(getTokenEndpoint, {
                username: username,
                password: password
            });

            if (response.data.auth_token) {
                const newToken = response.data.auth_token;
                setToken(newToken);
                console.log('Token received:', newToken);
                setError('');
                handleGetId(newToken); // Передаем полученный токен в функцию для получения ID
            } else {
                setError('Token not received. Check your credentials.');
            }
        } catch (error) {
            console.error('Error fetching token:', error);
            setError('Error fetching token. Please try again.');
        }
    };

    const handleGetId = async (newToken) => {
        const getIdEndpoint = `${apiUrl}/api/v1/auth/users/me/`;
        try {
            const response = await axios.get(getIdEndpoint, {
                headers: {
                    Authorization: `Token ${newToken}` // Обратите внимание на синтаксис для передачи токена
                }
            });
    
            if (response.data.id) {
                const currentId = response.data.id; // Сохраняем userId
                setUserId(currentId);
                console.log('ID in Token:', currentId);
                console.log('ID in state:', userId);
                console.log('Token in state:', token);
                setError('');
                handleGetAdmin(newToken, currentId);
            } else {
                setError('User ID not received. Check your credentials.');
            }
        } catch (error) {
            console.error('Error fetching user ID:', error);
            setError('Error fetching user ID. Please try again.');
        }
    };

    const handleGetAdmin = async (newToken, currentId) => {
        const getAdminEndpoint = `${apiUrl}/api/v1/alluser/`;
        try {
            const response = await axios.get(getAdminEndpoint, {
                headers: {
                    Authorization: `Token ${newToken}`
                }
            });
    
            // Применение фильтра по id пользователя для получения is_superuser
            const specificUserId = currentId; 
            const specificUser = response.data.find(user => user.id === specificUserId);
            // console.log('specificUser:', specificUser.is_superuser);
    
            if (specificUser && specificUser.is_superuser === true) {
                setIsAdmin(true); 
                console.log('This user is Admin');
                setError('');
                navigate("/users");
            } else {
                setIsAdmin(false); 
                console.log('This user is not a Admin');
                setError('Specific user is not a superuser.');
                navigate("/files");
            }
    
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Error fetching user data. Please try again.');
            navigate("/files");
        }
    }
    

    return (
        <div>
            <p>Please input your login and password</p>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleGetToken}>OK</button>
            {token && <p>Authentication successfully</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleBackMainPage}>Back to Main Page</button>
        </div>
    );
};

export default LoginUser;
