import React from 'react';
import './NormalLoader.css'; // Import the CSS file for styling

const NormalLoader = () => {
    
    return (
        <div className="loader">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
        </div>
    );
}

export default NormalLoader;