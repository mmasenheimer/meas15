import React, {useState} from 'react';
import './Map.css';

export default function Map() {

    const [location1, setLocation1] = useState('');
    const [location2, setLocation2] = useState('');
    const [display, setDisplay] = useState(1);

    const generateRoutes = () => {
        // Placeholder for route generation logic
    };

    const whichDisplay = () => {
        if (display === 1) {
            return (
                <div id = "display1">
                    <h1>Enter two locations to generate routes:</h1>
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
                    <button className="map-button" onClick={generateRoutes}>Generate Routes</button>
                </div>
            );
        } else if(display === 2) {
            return (
                <div id = "display2">
                    <h1>Generated Routes:</h1>
                </div>
            );
        } else if(display === 3) {
            return (
                <div id = "display3">
                    <h1>You saved carbon!</h1>
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