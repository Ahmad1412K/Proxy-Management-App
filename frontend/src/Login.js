import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();  

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            localStorage.setItem('token', response.data.access_token);
            alert('User logged in successfully');
            navigate('/dashboard'); 
        } catch (error) {
            alert(error.message);
        }
    };

    const handleSignUpRedirect = () => {
        navigate('/signup');
    };

    return (
        <div className="container flex-column">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="flex-column">
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button type="submit">Login</button>
                <button type="button" onClick={handleSignUpRedirect} className="secondary-button">Sign Up</button>

            </form>
        </div>
    );
}

export default Login;