import React, { useState, useEffect } from 'react';
import { machineryService } from '../services';
import './FindMachineryPage.css';

const FindMachineryPage = () => {
    const [machinery, setMachinery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ category: '', district: '' });

    useEffect(() => {
        fetchMachinery();
    }, [filters]);

    const fetchMachinery = async () => {
        try {
            const response = await machineryService.getAll(filters);
            if (response.data.success) {
                setMachinery(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching machinery:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="find-machinery-page">
            <h1>Find Agricultural Machinery</h1>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search machinery..."
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
                <select onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
                    <option value="">All Categories</option>
                    <option value="Tractor">Tractor</option>
                    <option value="Harvester">Harvester</option>
                    <option value="Rotavator">Rotavator</option>
                </select>
            </div>

            {loading ? (
                <div className="loading">Loading machinery...</div>
            ) : (
                <div className="machinery-grid">
                    {machinery.map((item) => (
                        <div key={item._id} className="machinery-card">
                            <div className="machinery-image">
                                {item.images?.length > 0 ? (
                                    <img src={item.images[0]} alt={item.machineryName} />
                                ) : (
                                    <div className="no-image">No Image</div>
                                )}
                            </div>
                            <div className="machinery-info">
                                <h3>{item.machineryName}</h3>
                                <p className="category">{item.category}</p>
                                <p className="location">{item.location?.district}</p>
                                <p className="price">₹{item.pricing?.price} {item.pricing?.unit}</p>
                                <button className="btn btn-primary">View Details</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FindMachineryPage;
