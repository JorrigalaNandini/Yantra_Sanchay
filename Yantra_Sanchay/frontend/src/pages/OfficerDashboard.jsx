import React, { useEffect, useState } from 'react';
import { requestService } from '../services';
import './OfficerDashboard.css';

const OfficerDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [requests, setRequests] = useState([]);

useEffect(() => {
    loadRequests();
}, []);

const loadRequests = async () => {
    try {
        const response = await requestService.getAll();
        console.log("Officer Requests Response =", response.data);
        if (response.data.success) {
            setRequests(response.data.data || []);
        }
    } catch (error) {
        console.error('Error loading requests:', error);
    }
};

    return (
        <div className="officer-dashboard">

            <h1>👮 Officer Dashboard - {user.name}</h1>

            <div className="dashboard-grid">

                <div className="card">
                    <h3>📋 Total Requests</h3>
                    <p>{requests.length} Farmer Requests</p>
                </div>

                <div className="card">
                    <h3>⏳ Pending Verification</h3>
                    <p>18 Requests Waiting</p>
                </div>

                <div className="card">
                    <h3>🚜 Available Machines</h3>
                    <p>47 Machines Ready</p>
                </div>

                <div className="card">
                    <h3>✅ Active Machines</h3>
                    <p>29 Machines In Use</p>
                </div>

                <div className="card">
                    <h3>🔧 Under Repair</h3>
                    <p>6 Machines Need Service</p>
                </div>

                <div className="card">
                    <h3>📍 Today's Visits</h3>
                    <p>9 Farm Inspections</p>
                </div>

            </div>
            <h2 className="section-title">📥 Farmer Requests</h2>

<div className="card">
    <h3>Pending Farmer Requests</h3>

    <p>Ramesh - Tractor Request - Pending Verification</p>
    <p>Suresh - Harvester Request - Approved</p>
    <p>Lakshmi - Rotavator Request - Pending Visit</p>
</div>
<h2 className="section-title">📍 Field Verification</h2>

<div className="card">
    <h3>Today's Farm Visits</h3>

    <p>Village: Medchal</p>
    <p>Farmer: Ramesh</p>
    <p>Machine: Tractor</p>
    <p>Status: Visit Scheduled</p>
</div>
<h2 className="section-title">🚜 Machinery Allocation</h2>

<div className="card">
    <h3>Current Allocation Status</h3>

    <p>Tractor-01 → Assigned to Ramesh</p>
    <p>Harvester-03 → Available</p>
    <p>Rotavator-02 → Assigned to Lakshmi</p>
    <p>Seeder-01 → Under Maintenance</p>
</div>
        </div>

        
    );
};

export default OfficerDashboard;