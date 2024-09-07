import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import './RegistrationForm.css';
import { AuthContext } from '../context/AuthContext';

// const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl = window.REACT_APP_API_URL;

const RegistrationForm = () => {
    
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        mode: 'onBlur',
    });
    const { userId, setUserId } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleBackMainPage = () => {
        navigate("/");
    };

    const onSubmit = async (data) => {
        const regEndpoint = `${apiUrl}/api/v1/auth/users/`;
        try {
            const jsonData = JSON.stringify(data); // Преобразуем данные в JSON
            console.log('Request Body:', jsonData); // Выводим тело запроса в консоль
            const response = await axios.post(regEndpoint, jsonData, {
                headers: {
                    'Content-Type': 'application/json', // Устанавливаем заголовок Content-Type
                },
            });

            if (response.status === 201) {
                console.log('User registered successfully:', response.data);
                const currentId = response.data.id;
                setUserId(currentId);
                console.log('ID:', userId);
                console.log('currentId:', currentId);
                navigate("/login");
            } else {
                console.error('Error registering user:', response.data);
            }
            reset();
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    return (
        <>
            <h1>Форма регистрации</h1>
            <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
 
                <label className="label">
                    Login:
                    <input className="input" {...register('username', {
                        required: "Обязательное поле!",
                        pattern: 
                        {
                            value: /^[a-zA-Z][a-zA-Z0-9]{3,19}$/,
                            message: 'Только латинские буквы и цифры, первый символ — буква, длина от 4 до 20 символов!'
                        }
                    })}/>
                </label>
                <div className="error">{errors?.login && <p>{errors?.login?.message || "Error"}</p>}</div>
 
                <label className="label">
                    FullName:
                    <input className="input" {...register('first_name', {
                        required: "Обязательное поле!"
                    })}/>
                </label>
                <div className="error">{errors?.first_name && <p>{errors?.first_name?.message || "Error"}</p>}</div>
 
                <label className="label">
                    Email:
                    <input className="input" {...register('email', {
                        required: "Обязательное поле!",
                        pattern:
                        {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Пример Email Ivanov@yandex.ru'
                        }
                    })}/>
                </label>
                <div className="error">{errors?.email && <p>{errors?.email?.message || "Error"}</p>}</div>
 
                <label className="label">
                    Password:
                    <input className="input" {...register('password', {
                        required: "Обязательное поле!",
                        pattern: {
                            value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s]).{6,}$/,
                            message: 'не менее 6 символов: как минимум одна заглавная буква, одна цифра и один специальный символ.'
                        }
                    })}/>
                </label>
                <div className="error">{errors?.password && <p>{errors?.password?.message || "Error"}</p>}</div>
 
                <input className="submit" type="submit" disabled={!isValid} />
 
            </form>
            <button onClick={handleBackMainPage}>Back to Main Page</button>
        </>
    )

    // return (
    //     <>
    //         <h1>Форма регистрации</h1>
    //         <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
    //             <label className="label">
    //                 Login:
    //                 <input className="input" {...register('username', { required: 'Обязательное поле!' })} />
    //             </label>
    //             <div className="error">{errors?.login && <p>{errors?.login?.message || 'Error'}</p>}</div>

    //             <label className="label">
    //                 FullName:
    //                 <input className="input" {...register('first_name', { required: 'Обязательное поле!' })} />
    //             </label>
    //             <div className="error">{errors?.first_name && <p>{errors?.first_name?.message || 'Error'}</p>}</div>

    //             <label className="label">
    //                 Email:
    //                 <input className="input" {...register('email', { required: 'Обязательное поле!' })} />
    //             </label>
    //             <div className="error">{errors?.email && <p>{errors?.email?.message || 'Error'}</p>}</div>

    //             <label className="label">
    //                 Password:
    //                 <input className="input" {...register('password', { required: 'Обязательное поле!' })} />
    //             </label>
    //             <div className="error">{errors?.password && <p>{errors?.password?.message || 'Error'}</p>}</div>

    //             <input className="submit" type="submit" disabled={!isValid} />

    //         </form>
    //         <button onClick={handleBackMainPage}>Back to Main Page</button>
    //     </>
    // );
};

export default RegistrationForm;
