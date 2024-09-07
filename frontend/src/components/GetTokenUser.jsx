import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const GetTokenUser = async () => {
    const { token, userId, userToken, setUserToken } = useContext(AuthContext);
    console.log('token: ', token);
    console.log('userId: ', userId);
    console.log('userToken: ', userToken);
    try {
        const response = await axios.post(`http://127.0.0.1:8000/api/v1/get-user-token/`, {
            user_id: userId
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Token ${token}`
            }
        });
        const currentToken = response.data.token;
        setUserToken(currentToken);
        console.log('response.data.token: ', currentToken);
    } catch (error) {
        console.error('Error updating file:', error);
    }
}

export default GetTokenUser;