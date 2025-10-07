import React from 'react';
import { createRoot } from 'react-dom/client';

console.log('Content script loaded');

const injectElement = () => {
    const container = document.createElement('div');
    container.id = 'ai-extension-root';
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px',
            background: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            borderRadius: '4px'
        }}>
            AI Extension Loaded
        </div>
    );
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectElement);
} else {
    // injectElement();
} 