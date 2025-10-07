import React, { useState, useEffect } from 'react';

interface AISelectionFormProps {
    onSaved: (model: string) => void;
}

const AISelectionForm: React.FC<AISelectionFormProps> = ({ onSaved }) => {
    const [selectedAI, setSelectedAI] = useState('openai');
    const [apiKey, setApiKey] = useState('');
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        chrome.storage.local.get(['aiProvider', 'apiKey'], (result) => {
            if (result.aiProvider) setSelectedAI(result.aiProvider);
            if (result.apiKey) setApiKey(result.apiKey);
        });
    }, []);

    const handleSave = () => {
        chrome.storage.local.set({
            aiProvider: selectedAI,
            apiKey: apiKey
        }, () => {
            setSaveStatus('Settings saved successfully!');

            setTimeout(() => {
                setSaveStatus('');
                chrome.storage.local.get(['model'], (result) => {
                    const defaultModel = result.model || 'gpt-4';
                    onSaved(defaultModel);
                });
            }, 1000);
        });
    };

    return (
        <div className="ai-selection-form">
            <h2>AI Configuration</h2>

            <div className="form-group">
                <label htmlFor="ai-provider">AI Provider</label>
                <select
                    id="ai-provider"
                    value={selectedAI}
                    onChange={(e) => setSelectedAI(e.target.value)}
                    disabled
                >
                    <option value="openai">OpenAI</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="api-key">API Key</label>
                <input
                    type="password"
                    id="api-key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your OpenAI API key"
                />
            </div>

            <button
                className="save-button"
                onClick={handleSave}
                disabled={!apiKey.trim()}
            >
                Save Settings
            </button>

            {saveStatus && <div className="save-status">{saveStatus}</div>}
        </div>
    );
};

export default AISelectionForm; 