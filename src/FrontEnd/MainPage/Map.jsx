import React, {useState} from 'react';

export default function Map() {

    const [location1, setLocation1] = useState('');
    const [location2, setLocation2] = useState('');
    const [display, setDisplay] = useState(1);

    const generateRoutes = async () => {
        if (location1.trim() === "" || location2.trim() === "") {
            setError("Locations cannot be empty");
            return;
        }
        try {
        const response = await fetch("/api/maps/getActivity", {
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
                    <button onClick = {() => generateRoutes()}> Generate Routes </button>
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
        <div id="map">
            {whichDisplay()}
        </div>
    )
}