import React, { useState, useEffect } from 'react';

interface AISelectionFormProps {
    onSaved: (model: string) => void;
}

const AISelectionForm: React.FC<AISelectionFormProps> = ({ onSaved }) => {
    const [selectedAI, setSelectedAI] = useState('openai');
    const [apiKey, setApiKey] = useState('');
    const [apiUrl, setApiUrl] = useState('http://localhost:3000/api/summarize');
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        chrome.storage.local.get(['aiProvider', 'apiKey', 'apiUrl'], (result) => {
            if (result.aiProvider) setSelectedAI(result.aiProvider);
            if (result.apiKey) setApiKey(result.apiKey);
            if (result.apiUrl) setApiUrl(result.apiUrl);
        });
    }, []);

    const handleSave = () => {
        chrome.storage.local.set({
            aiProvider: selectedAI,
            apiKey: apiKey,
            apiUrl: apiUrl
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
                >
                    <option value="openai">OpenAI</option>
                    <option value="sumwise">Sumwise API (Local)</option>
                </select>
            </div>

            {selectedAI === 'openai' && (
                <div className="form-group">
                    <label htmlFor="api-key">OpenAI API Key</label>
                    <input
                        type="password"
                        id="api-key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your OpenAI API key"
                    />
                </div>
            )}

            {selectedAI === 'sumwise' && (
                <div className="form-group">
                    <label htmlFor="api-url">Sumwise API URL</label>
                    <input
                        type="text"
                        id="api-url"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        placeholder="http://localhost:3000/api/summarize"
                    />
                    <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                        Make sure your local server is running
                    </small>
                </div>
            )}

            <button
                className="save-button"
                onClick={handleSave}
                disabled={selectedAI === 'openai' ? !apiKey.trim() : !apiUrl.trim()}
            >
                Save Settings
            </button>

            {saveStatus && <div className="save-status">{saveStatus}</div>}
        </div>
    );
};

export default AISelectionForm; 