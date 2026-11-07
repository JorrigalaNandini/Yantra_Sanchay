import React from 'react';
import { Link } from 'react-router-dom';
import './RoleSelectionPage.css';

const RoleSelectionPage = () => {
    return (
        <div className="role-selection-page">
            <div className="role-container">
                <h1>🚜 Yantra Sanchay</h1>
                <p>Choose your role to continue</p>

                <div className="role-cards">
                    <Link to="/register" className="role-card" onClick={() => localStorage.setItem('selectedRole', 'farmer')}>
                        <div className="role-icon">🌾</div>
                        <h2>Farmer</h2>
                        <p>Find agricultural machinery and access farming support</p>
                        <button>Select</button>
                    </Link>

                    <Link to="/register" className="role-card" onClick={() => localStorage.setItem('selectedRole', 'machinery_provider')}>
                        <div className="role-icon">🚜</div>
                        <h2>Machinery Provider</h2>
                        <p>List agricultural machinery and respond to farmer requests</p>
                        <button>Select</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionPage;
