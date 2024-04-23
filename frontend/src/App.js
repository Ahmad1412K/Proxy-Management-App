import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProxiesProvider } from './context/ProxiesContext';
import Signup from './Signup';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
    return (
        <Router>
            <AuthProvider>
                <ProxiesProvider>
                    <Routes>
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/" element={<Login />} />
                    </Routes>
                </ProxiesProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;