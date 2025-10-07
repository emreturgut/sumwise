import React, { useState, useEffect } from 'react';
import AISelectionForm from './components/AISelectionForm';
import SummarizeComponent from './components/SummarizeComponent';
import './styles/AISelectionForm.css';
import './styles/SummarizeComponent.css';

const Popup: React.FC = () => {
    const [hasApiKey, setHasApiKey] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [selectedModel, setSelectedModel] = useState('gpt-4');

    useEffect(() => {
        chrome.storage.local.get(['apiKey', 'model'], (result) => {
            if (result.apiKey) {
                setHasApiKey(true);
                setShowSettings(false);
            } else {
                setShowSettings(true);
            }

            if (result.model) {
                setSelectedModel(result.model);
            }
        });
    }, []);

    const handleApiKeySaved = (model: string) => {
        setHasApiKey(true);
        setShowSettings(false);
        setSelectedModel(model);
    };

    const handleBackToSettings = () => {
        setShowSettings(true);
    };

    return (
        <div className="popup-container">
            {(showSettings || !hasApiKey) ? (
                <AISelectionForm onSaved={handleApiKeySaved} />
            ) : (
                <SummarizeComponent
                    onBackToSettings={handleBackToSettings}
                    selectedModel={selectedModel}
                />
            )}
        </div>
    );
};

export default Popup; 