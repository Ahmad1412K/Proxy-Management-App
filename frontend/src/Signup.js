import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();  

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:5000/register', { username, password });
            alert('User registered successfully');
            navigate('/login');  
        } catch (error) {
            alert('Failed to register user');
        }
    };

    return (
        <div className="container flex-column">
            <h2>Signup</h2>
            <form onSubmit={handleSubmit} className="flex-column">
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Signup;