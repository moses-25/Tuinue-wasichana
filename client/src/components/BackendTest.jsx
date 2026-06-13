import React, { useState, useEffect } from 'react';
import { healthAPI, charityAPI, apiUtils } from '../services/api';

const BackendTest = () => {
  const [healthStatus, setHealthStatus] = useState('checking...');
  const [charitiesCount, setCharitiesCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        // Test health endpoint
        const healthResponse = await healthAPI.checkHealth();
        setHealthStatus('✅ Connected');

        // Test charities endpoint
        const charitiesResponse = await charityAPI.getCharities();
        if (charitiesResponse.success) {
          setCharitiesCount(charitiesResponse.charities?.length || 0);
        }
      } catch (err) {
        console.error('Backend test error:', err);
        setHealthStatus('❌ Connection failed');
        setError(err.message);
      }
    };

    testBackendConnection();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '10px', 
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div><strong>Backend Status:</strong> {healthStatus}</div>
      <div><strong>Charities loaded:</strong> {charitiesCount}</div>
      <div><strong>Auth token:</strong> {apiUtils.isAuthenticated() ? '✅' : '❌'}</div>
      {error && <div style={{ color: 'red' }}><strong>Error:</strong> {error}</div>}
    </div>
  );
};

export default BackendTest;