import React from 'react';
import './HomePage.css'; // 1. Import the CSS file

export default function HomePage({changePage, onLogOut}) {
    return (
        <div className="page-container">
            {/* 2. Side banner placeholder to match your layout */}
            <nav className="side-banner"></nav>

            {/* 3. The actual content area */}
            <main className="content-area">
                <h1>Hello, Welcome!!!</h1>
                <p>Ready to save the planet today?</p>
            </main>
        </div>
    );
}