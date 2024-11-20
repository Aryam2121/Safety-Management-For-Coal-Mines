// src/components/Alerts.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/alerts');
                setAlerts(res.data);
            } catch (error) {
                console.error('Error fetching alerts:', error);
            }
        };
        fetchAlerts();
    }, []);

    return (
        <div className="alerts">
            <h2 className="text-lg font-bold mb-4">Real-time Safety Alerts</h2>
            <ul>
                {alerts.map((alert) => (
                    <li key={alert._id}>
                        {alert.sensorType} - {alert.level} - {alert.status} at{' '}
                        {new Date(alert.timestamp).toLocaleTimeString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Alerts;
