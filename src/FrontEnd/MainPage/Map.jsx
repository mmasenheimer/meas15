import React, {useState} from 'react';
import './HomePage.css';

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
            <nav className="side-banner"></nav>
            <main className="content-area">
                <div id="map">
                    <h1>Map</h1>
                    {whichDisplay()}
                </div>
            </main>
        </div>
    )
}