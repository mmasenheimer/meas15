import React, {useState} from 'react';
const { PythonShell } = require('python-shell');

export default function Map() {

    const [location1, setLocation1] = useState('');
    const [location2, setLocation2] = useState('');
    const [display, setDisplay] = useState(1);

    const generateRoutes = () => {
        let options = {
            mode: 'text',
            args: [location1, location2]
            };

            PythonShell.run('/src/algorithm/main.py', options).then(messages => {
                // messages is an array of responses from the python script
                console.log('Results:', messages);
            });
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
        <div id="map">
            <h1>Map</h1>
            
        </div>
    )
}