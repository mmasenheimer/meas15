import { set } from 'mongoose';
import React, {useState} from 'react';
import './HomePage.css';

export default function Map() {

    const [location1, setLocation1] = useState('');
    const [location2, setLocation2] = useState('');
    const [display, setDisplay] = useState(1);
    const [routes, setRoutes] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);

    const generateRoutes = async () => {
        if (location1.trim() === "" || location2.trim() === "") {
            setError("Locations cannot be empty");
            return;
        }
        try {
        const response = await fetch("/api/map/getActivity", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ start: location1, destination: location2 }),
        });

        if (!response.ok) {
            throw new Error(response.error);
        }

        const data = await response.json();
        console.log(data);
        setRoutes(data);
        setDisplay(2);
        } catch (err) {
            setError(err.message || "An error occurred during create group");
        }
    };

    const whichDisplay = () => {
        if (display === 1) {
            return (
                <div id = "display1">
                    <h1>Enter two locations to generate routes:</h1>
                    <input
                        type="text"
                        value={location1}
                        onChange={(e) => setLocation1(e.target.value)}
                    />
                    <input
                        type="text"
                        value={location2}
                        onChange={(e) => setLocation2(e.target.value)}
                    />
                    <button> Generate Routes </button>
                </div>
            );
        } else if(display === 2) {
            return (
                <div id = "display2">
                    <h1>Generated Routes:</h1>
                    {routes.map((route) => () => {
                        <div classname = "route">
                            <h1>{route.label}</h1>
                            <text>  
                                Arrives: {route.arrives}\n 
                                Departs: {route.departs}\n
                                Duration: {route.duration}\n
                                Distance: {route.distance}\n
                            </text>
                            <h1>You can save {route.points} grams of carbon by choosing this route!</h1>
                            <h1>Steps:</h1>
                            {route.steps.map((step) => () => {
                                <p className = "step">{step}</p>
                            })}
                        </div>
                    })
                    }
                    <select value={selectedRoute} onChange={(e) => {setSelectedRoute(e.target.value); setDisplay(3)}}>
                        <option value="">Select a route!</option>
                        {routes.map((route) => (
                            <option key={route.label} value={route.key()}>{route.label}</option>
                        ))}
                    </select>
                </div>
            );
        } else if(display === 3) {
            
            return (
                <div id = "display3">
                    <h1>You saved {routes[selectedRoute].points} grams of carbon!</h1>
                </div>
            );
        }
    }
    

    return (
        <div className="page-container">
            <div className="side-banner"></div>
            <div className="content-area" id="map">
                <h1>Map</h1>
                
            </div>
        </div>
    )
}