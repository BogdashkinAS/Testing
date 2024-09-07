import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TestList = () => {
    const navigate = useNavigate();
    const { token, userId, isAdmin } = useContext(AuthContext);

    const changeItem = () => {
        console.log('token ', token);
        console.log('userId ', userId);
        console.log('isAdmin ', isAdmin);
      };

    const handleFilesList = () => {
        navigate("/files");
    };
 
    return (
        <div>
            <h2>Текущее состояние AuthContext:</h2>
            <p>Токен (Token): {token}</p>
            <p>Идентификатор пользователя (User ID): {userId}</p>
            <p>Администратор (Admin): {isAdmin ? 'Да' : 'Нет'}</p>
            <button onClick={changeItem}>Test Console</button>
            <button onClick={handleFilesList}>User Files List</button>
        </div>
    );
};

export default TestList;
