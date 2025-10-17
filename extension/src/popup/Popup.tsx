import React from 'react';
import SummarizeComponent from './components/SummarizeComponent';
import './styles/SummarizeComponent.css';

const Popup: React.FC = () => {
    return (
        <div className="popup-root">
            <div className="header-bar">
                <div className="brand">
                    <span className="brand-name">Sumwise</span>
                </div>
            </div>
            <div className="popup-container">
                <SummarizeComponent />
            </div>
        </div>
    );
};

export default Popup; 