import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ProxiesContext = createContext([]);

export const ProxiesProvider = ({ children }) => {
    const [proxies, setProxies] = useState([]);
    const { authToken } = useAuth();

    const fetchProxies = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/proxy', {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setProxies(response.data);
        } catch (error) {
            console.error("Error fetching proxies", error);
        }
    }, [authToken]); 

    useEffect(() => {
        if (authToken) {
            fetchProxies();
        }
    }, [authToken, fetchProxies]); 

    const addProxy = async (ip, port) => {
        try {
            await axios.post('http://localhost:5000/proxy', { ip_address: ip, port: port }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            fetchProxies();
        } catch (error) {
            console.error("Error adding proxy", error);
        }
    };

    const deleteProxy = async (proxyId) => {
        try {
            await axios.delete(`http://localhost:5000/proxy/${proxyId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            fetchProxies();
        } catch (error) {
            console.error("Error deleting proxy", error);
        }
    };

    return (
        <ProxiesContext.Provider value={{ proxies, addProxy, deleteProxy }}>
            {children}
        </ProxiesContext.Provider>
    );
};

export const useProxies = () => useContext(ProxiesContext);
