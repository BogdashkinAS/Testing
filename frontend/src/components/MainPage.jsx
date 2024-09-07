import React from 'react';
import { NavLink } from 'react-router-dom';

const MainPage = () => {
    
    return (
        <div>
            <h1>Облачное хранилище My Cloud</h1>
            <ul>
                <li><NavLink to="/reg">Register</NavLink></li>
                <li><NavLink to="/login">Login</NavLink></li>
            </ul>
        </div>
    );
};
    
export default MainPage;