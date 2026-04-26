import React, { useState } from 'react';
import './Map.css';

export default function Map() {
    const [location1, setLocation1] = useState('');
    const [location2, setLocation2] = useState('');
    const [display, setDisplay] = useState(1);
    const [routes, setRoutes] = useState([]); // Initialized as array
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [error, setError] = useState("");

    const generateRoutes = async () => {
        if (location1.trim() === "" || location2.trim() === "") {
            setError("Locations cannot be empty");
            return;
        }
        try {
            const response = await fetch("/api/map/getActivity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ start: location1, destination: location2 }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch routes");
            }

            const data = await response.json();
            setRoutes(data);
            setDisplay(2);
        } catch (err) {
            setError(err.message);
        }
    };

    const whichDisplay = () => {
        if (display === 1) {
            return (
                <div id="display1">
                    <h2>Enter two locations to generate routes:</h2>
                    <div className="form-group">
                        <label htmlFor="location1">Location from</label>
                        <input
                            id="location1"
                            type="text"
                            value={location1}
                            onChange={(e) => setLocation1(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="location2">Location to</label>
                        <input
                            id="location2"
                            type="text"
                            value={location2}
                            onChange={(e) => setLocation2(e.target.value)}
                        />
                    </div>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    <button className="map-button" onClick={generateRoutes}>
                        Generate Routes
                    </button>
                </div>
            );
        } else if (display === 2) {
            return (
                <div id="display2">
                    <h1>Generated Routes:</h1>
                    {routes.map((route, index) => (
                        <div key={index} className="route-container">
                            <h1>{route.label}</h1>
                            <p>  
                                Arrives: {route.arrives}<br/> 
                                Departs: {route.departs}<br/>
                                Duration: {route.duration}<br/>
                                Distance: {route.distance}<br/>
                            </p>
                            <h1>You can save {route.points} grams of carbon!</h1>
                            <button 
                                className="map-button" 
                                onClick={() => {setSelectedRoute(index); setDisplay(3)}}
                            >
                                Select this Route
                            </button>
                        </div>
                    ))}
                </div>
            );
        } else if (display === 3) {
            return (
                <div id="display3">
                    <h1>You saved {routes[selectedRoute].points} grams of carbon!</h1>
                    <button className="map-button" onClick={() => setDisplay(1)}>
                        Start Over
                    </button>
                </div>
            );
        }
    }

    return (
        <div className="page-container">
            <div className="side-banner"></div>
            <div className="content-area" id="map">
                <h1>Map</h1>
                {whichDisplay()}
            </div>
        </div>
    )
}