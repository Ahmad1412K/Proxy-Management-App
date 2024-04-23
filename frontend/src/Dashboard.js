import React, { useState } from 'react';
import { useProxies } from './context/ProxiesContext';
import { useAuth } from './context/AuthContext';  
import { useNavigate } from 'react-router-dom'; 
import './App.css';


function Dashboard() {
    const { proxies, addProxy, deleteProxy } = useProxies();
    const { logout } = useAuth(); 
    const navigate = useNavigate();

    const [newProxyIp, setNewProxyIp] = useState('');
    const [newProxyPort, setNewProxyPort] = useState('');

    const handleAddProxyClick = () => {
        if (!newProxyIp || !newProxyPort) {
            alert("Please enter both IP address and port.");
            return;
        }
        addProxy(newProxyIp, newProxyPort);
        setNewProxyIp('');
        setNewProxyPort('');
    };

    const handleDeleteProxyClick = (proxyId) => {
        deleteProxy(proxyId);
    };

    const handleLogout = () => {
        logout();  
        navigate('/login'); 
    };

    return (
        <div>
            <div className="dashboard-container">
                <div className="add-proxy-form">
                    <h2>Add New Proxy</h2>
                    <input
                        type="text"
                        placeholder="IP Address"
                        value={newProxyIp}
                        onChange={(e) => setNewProxyIp(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Port"
                        value={newProxyPort}
                        onChange={(e) => setNewProxyPort(e.target.value)}
                    />
                    <button onClick={handleAddProxyClick}>Add Proxy</button>
                </div>
                <div className="proxy-list">
                    <h2>My Proxies</h2>
                    <ul>
                        {proxies.map(proxy => (
                            <li key={proxy.id}>
                                {proxy.ip_address}:{proxy.port} - Status: {proxy.status}
                                <button className="delete-button" onClick={() => handleDeleteProxyClick(proxy.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <button onClick={handleLogout} className="logout-button" >Logout</button> {/* Logout Button */}
        </div>
    );
}

export default Dashboard;