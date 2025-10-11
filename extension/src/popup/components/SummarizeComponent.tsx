import * as pdfjsLib from 'pdfjs-dist';
import React, { useState, useEffect } from 'react';

if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
    try {
        const workerUrl = chrome.runtime.getURL('js/pdf.worker.min.js');
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
        console.log('POPUP: PDF.js workerSrc set to:', workerUrl);
    } catch (e) {
        console.error('POPUP: Error setting PDF.js workerSrc:', e);
    }
} else if (typeof window !== 'undefined') {
    console.warn('POPUP: Worker type is undefined, PDF.js might run on main thread or fail.');
}

interface SummarizeComponentProps {
    onBackToSettings: () => void;
    selectedModel: string;
}

type ContentType = 'webpage' | 'pdf' | 'youtube';

interface SummaryResult {
    title: string;
    summary: string;
    sourceUrl?: string;
}

const MIN_CHAR_LIMIT = 100;
const MAX_CHAR_LIMIT = 2000;
const DEFAULT_CHAR_LIMIT = 300;

interface Language {
    code: string;
    name: string;
    flag: string;
    abbr: string;
}

const LANGUAGES: Language[] = [
    { code: 'auto', name: 'Auto-detect', flag: '🌐', abbr: 'Auto' },
    { code: 'en', name: 'English', flag: '🇬🇧', abbr: 'EN' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷', abbr: 'TR' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', abbr: 'AR' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', abbr: 'DE' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', abbr: 'FR' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', abbr: 'IT' },
];

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function extractTextFromStructNode(node: any): string {
    let text = "";
    if (!node) {
        return text;
    }

    if (typeof node === 'string') {
        text += node + " ";
    }
    if (node.nodeValue) {
        text += node.nodeValue + " ";
    }

    if (typeof node === 'object') {
        if (node.alt) {
            text += node.alt + " ";
        }
        if (node.children && Array.isArray(node.children)) {
            for (const child of node.children) {
                text += extractTextFromStructNode(child);
            }
        }
    }
    return text;
}

const SummarizeComponent: React.FC<SummarizeComponentProps> = ({ onBackToSettings, selectedModel: initialModel }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState(initialModel || 'o4-mini');
    const [aiProvider, setAiProvider] = useState('openai');
    const [contentType, setContentType] = useState<ContentType>('webpage');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [currentUrl, setCurrentUrl] = useState('');
    const [embeddedPdfUrl, setEmbeddedPdfUrl] = useState<string | null>(null);
    const [summary, setSummary] = useState<SummaryResult | null>(null);
    const [error, setError] = useState('');
    const [characterLimit, setCharacterLimit] = useState(DEFAULT_CHAR_LIMIT);
    const [isCharLimitOpen, setIsCharLimitOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [autoDetectContent, setAutoDetectContent] = useState(true);

    useEffect(() => {
        getCurrentTab();
        // Load AI provider
        chrome.storage.local.get(['aiProvider'], (result) => {
            if (result.aiProvider) {
                setAiProvider(result.aiProvider);
            }
        });
    }, []);

    const getCurrentTab = async () => {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const activeTab = tabs[0];
            if (activeTab?.url && activeTab.id !== undefined) {
                setCurrentUrl(activeTab.url);
                await detectContentType(activeTab.url, activeTab.id);
            }
        } catch (error) {
            console.error('Error getting current tab:', error);
        }
    };

    const detectContentType = async (url: string, tabId: number) => {
        setEmbeddedPdfUrl(null);
        console.log(`POPUP: detectContentType called for URL: ${url}, TabID: ${tabId}`);

        if (isPdfUrl(url)) {
            setContentType('pdf');
            console.log('POPUP: Detected PDF by URL extension.');
        } else if (isYoutubeUrl(url)) {
            setContentType('youtube');
            setYoutubeUrl(url);
            console.log('POPUP: Detected YouTube URL.');
        } else {
            try {
                console.log('POPUP: Not a direct PDF/YouTube URL, checking Content-Type from background...');
                const response = await chrome.runtime.sendMessage({
                    type: 'GET_CONTENT_TYPE',
                    tabId: tabId
                });
                const contentTypeHeader = response?.contentType as string | null;
                console.log(`POPUP: Received Content-Type from background: ${contentTypeHeader}`);

                if (contentTypeHeader && contentTypeHeader.toLowerCase().includes('application/pdf')) {
                    setContentType('pdf');
                    console.log('POPUP: Detected PDF by Content-Type header.');
                } else {
                    console.log('POPUP: Not a PDF by Content-Type, checking for embedded PDF...');
                    try {
                        const results = await chrome.scripting.executeScript<[], { isEmbeddedPdf: boolean; pdfUrl: string | null }>({
                            target: { tabId: tabId },
                            func: checkForEmbeddedPdf,
                        });
                        console.log('POPUP: checkForEmbeddedPdf script execution result:', results);

                        if (chrome.runtime.lastError) {
                            console.warn(`POPUP: Error injecting script for embedded PDF detection: ${chrome.runtime.lastError.message}`);
                            setContentType('webpage');
                            return;
                        }

                        const embeddedCheckResult = results?.[0]?.result;
                        console.log('POPUP: Parsed embeddedCheckResult:', embeddedCheckResult);
                        if (embeddedCheckResult?.isEmbeddedPdf && embeddedCheckResult.pdfUrl) {
                            setContentType('pdf');
                            setEmbeddedPdfUrl(embeddedCheckResult.pdfUrl);
                            console.log(`POPUP: Detected EMBEDDED PDF. URL set to: ${embeddedCheckResult.pdfUrl}`);
                        } else {
                            setContentType('webpage');
                            console.log('POPUP: No embedded PDF found, setting type to webpage.');
                        }
                    } catch (embedError) {
                        console.warn('POPUP: Error checking for embedded PDF:', embedError);
                        setContentType('webpage');
                    }
                }
            } catch (error) {
                console.warn('POPUP: Error getting content type from background script or processing embedded check:', error);
                setContentType('webpage');
            }
        }
    };

    const isPdfUrl = (url: string): boolean => {
        return url.toLowerCase().endsWith('.pdf') ||
            url.toLowerCase().includes('.pdf?') ||
            url.toLowerCase().includes('/pdf/') ||
            url.toLowerCase().includes('application/pdf');
    };

    const isYoutubeUrl = (url: string): boolean => {
        return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch|youtu\.be\/)/i.test(url);
    };

    useEffect(() => {
        setSelectedModel(initialModel);
    }, [initialModel]);

    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newModel = e.target.value;
        setSelectedModel(newModel);

        chrome.storage.local.set({ model: newModel }, () => {
            console.log('Model saved:', newModel);
        });
    };

    const handleContentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setContentType(e.target.value as ContentType);
        setAutoDetectContent(false);
        setSummary(null);
        setError('');
    };

    const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPdfFile(e.target.files[0]);
        }
    };

    const handleCharacterLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCharacterLimit(parseInt(e.target.value));
    };

    const toggleCharLimitAccordion = () => {
        setIsCharLimitOpen(!isCharLimitOpen);
    };

    const toggleLanguageDropdown = () => {
        setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
    };

    const selectLanguage = (language: Language) => {
        setSelectedLanguage(language);
        setIsLanguageDropdownOpen(false);
    };

    const handleSummarize = async () => {
        setIsLoading(true);
        setError('');
        setSummary(null);
        console.log(`POPUP: handleSummarize triggered. ContentType: ${contentType}, EmbeddedPDF URL: ${embeddedPdfUrl}, CurrentURL: ${currentUrl}`);

        try {
            let content = '';
            let title = '';
            let sourceUrl = '';
            let pageLang = 'auto';

            switch (contentType) {
                case 'webpage':
                    const webContent = await extractWebPageContent();
                    content = webContent.content;
                    title = webContent.title;
                    sourceUrl = webContent.url;
                    pageLang = webContent.language || 'auto';
                    break;

                case 'pdf':
                    console.log('POPUP: Handling PDF summarization.');
                    if (embeddedPdfUrl) {
                        console.log(`POPUP: Summarizing EMBEDDED PDF from URL: ${embeddedPdfUrl}`);
                        content = await extractPdfFromUrl(embeddedPdfUrl);
                        title = "Embedded PDF Document";
                        sourceUrl = embeddedPdfUrl;
                    } else if (isPdfUrl(currentUrl)) {
                        console.log(`POPUP: Summarizing PDF from direct URL: ${currentUrl}`);
                        content = await extractPdfFromUrl(currentUrl);
                        title = "PDF Document from URL";
                        sourceUrl = currentUrl;
                    } else if (pdfFile) {
                        console.log(`POPUP: Summarizing PDF from UPLOADED file: ${pdfFile.name}`);
                        content = await extractPdfContent(pdfFile);
                        title = pdfFile.name;
                    } else {
                        console.error('POPUP: PDF summarization branch entered but no valid PDF source found.');
                        throw new Error('Please select a PDF file, navigate to a PDF page, or be on a page with an embedded PDF.');
                    }
                    break;

                case 'youtube':
                    const videoUrl = youtubeUrl || currentUrl;
                    if (!videoUrl || !isValidYoutubeUrl(videoUrl)) {
                        throw new Error('Please enter a valid YouTube URL or navigate to a YouTube video');
                    }
                    
                    // YouTube için özel işlem - direkt endpoint'e gönder
                    const targetLang = selectedLanguage.code === 'auto' ? pageLang : selectedLanguage.code;
                    const effectiveCharLimit = isCharLimitOpen ? characterLimit : 0;
                    const youtubeResult = await summarizeYouTubeVideo(videoUrl, effectiveCharLimit, targetLang);
                    
                    setSummary({
                        title: youtubeResult.title,
                        summary: youtubeResult.summary,
                        sourceUrl: youtubeResult.sourceUrl
                    });
                    setIsLoading(false);
                    return; // Early return for YouTube
            }

            const targetLang = selectedLanguage.code === 'auto' ? pageLang : selectedLanguage.code;

            const effectiveCharLimit = isCharLimitOpen ? characterLimit : 0;
            const summaryText = await summarizeWithAI(content, effectiveCharLimit, targetLang);

            setSummary({
                title,
                summary: summaryText,
                sourceUrl
            });
        } catch (error) {
            console.error('Error:', error);
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const extractWebPageContent = async (): Promise<{ title: string, url: string, content: string, language?: string }> => {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const activeTab = tabs[0];

        if (!activeTab?.id) {
            throw new Error('No active tab found');
        }

        const results = await chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: extractArticleContent,
        });

        if (chrome.runtime.lastError) {
            throw new Error(`Error executing script: ${chrome.runtime.lastError.message}`);
        }

        return results[0].result as { title: string, url: string, content: string, language?: string };
    };

    const extractTextFromPdfArrayBuffer = async (arrayBuffer: ArrayBuffer): Promise<string> => {
        console.log('POPUP: Extracting text from ArrayBuffer. Size:', arrayBuffer.byteLength);
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, verbosity: 0 }).promise;
        console.log('POPUP: PDF document loaded from ArrayBuffer. Pages:', pdf.numPages);
        let allPagesText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            let pageTextFromContent = '';
            let pageTextFromStructTree = '';

            try {
                const textContent = await page.getTextContent();
                pageTextFromContent = textContent.items.map(item => (item as any).str).join(' ').trim();
            } catch (e) {
                console.warn(`POPUP: Error getting textContent for page ${i}:`, e);
            }

            try {
                const structTree = await page.getStructTree();
                if (structTree && structTree.children) {
                    pageTextFromStructTree = structTree.children
                        .map(child => extractTextFromStructNode(child))
                        .join('')
                        .trim();
                }
            } catch (e) {
                console.warn(`POPUP: Error getting or processing structTree for page ${i}:`, e);
            }

            let combinedPageText = pageTextFromContent;
            if (pageTextFromStructTree.length > 0) {
                if (!pageTextFromContent.toLowerCase().includes(pageTextFromStructTree.toLowerCase().substring(0, Math.min(pageTextFromStructTree.length, 50)))) {
                    combinedPageText += (combinedPageText.length > 0 ? '\n\n' : '') + '--- Structural Text ---\n' + pageTextFromStructTree;
                }
            }

            if (combinedPageText.length > 0) {
                allPagesText += combinedPageText + '\n\n';
            }
        }

        const finalText = allPagesText.trim();
        console.log('POPUP: Extracted final text from ArrayBuffer. Length:', finalText.length);
        return finalText;
    };

    const extractPdfFromUrl = async (url: string): Promise<string> => {
        console.log(`POPUP: Requesting Base64 PDF data from URL via background: ${url}`);
        try {
            const response = await chrome.runtime.sendMessage({
                type: 'FETCH_PDF_ARRAY_BUFFER_FROM_URL',
                url: url
            });

            if (response.error) {
                console.error(`POPUP: Error from background fetching Base64 PDF data from ${url}:`, response.error);
                throw new Error(response.error);
            }
            if (response.base64PdfData && typeof response.base64PdfData === 'string') {
                console.log(`POPUP: Received Base64 PDF data from background for ${url}.`);
                const arrayBuffer = base64ToArrayBuffer(response.base64PdfData);
                return await extractTextFromPdfArrayBuffer(arrayBuffer);
            }
            throw new Error(response.error || 'Invalid or missing Base64 PDF data from background.');
        } catch (error) {
            console.error(`POPUP: Failed to get Base64 PDF data from background for ${url}:`, error);
            // @ts-ignore
            throw new Error(error.message || 'Communication error with background for Base64 PDF data.');
        }
    };

    const extractPdfContent = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        console.log('POPUP: Extracting PDF from File object. Name:', file.name);
        return await extractTextFromPdfArrayBuffer(arrayBuffer);
    };

    const isValidYoutubeUrl = (url: string): boolean => {
        const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        return regex.test(url);
    };

    const extractYoutubeVideoId = (url: string): string => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : '';
    };

    const summarizeYouTubeVideo = async (
        videoUrl: string, 
        maxCharacters: number, 
        targetLanguage: string
    ): Promise<{ title: string; summary: string; sourceUrl: string }> => {
        const result = await chrome.storage.local.get(['aiProvider', 'apiKey', 'apiUrl']);
        const aiProvider = result.aiProvider || 'openai';
        const apiUrl = result.apiUrl || 'http://localhost:3000';
        
        // Route to the correct provider
        if (aiProvider === 'sumwise') {
            return await summarizeYouTubeWithSumwise(videoUrl, maxCharacters, targetLanguage, apiUrl);
        }
        
        // OpenAI için YouTube özetleme (eski yöntem - placeholder)
        throw new Error('YouTube summarization with OpenAI is not yet implemented. Please use Sumwise API.');
    };

    const summarizeYouTubeWithSumwise = async (
        videoUrl: string,
        maxCharacters: number,
        targetLanguage: string,
        apiUrl: string
    ): Promise<{ title: string; summary: string; sourceUrl: string }> => {
        try {
            // Prepare summary length based on character limit
            let summaryLength: 'short' | 'medium' | 'long' = 'medium';
            if (maxCharacters > 0) {
                if (maxCharacters <= 300) {
                    summaryLength = 'short';
                } else if (maxCharacters >= 600) {
                    summaryLength = 'long';
                }
            }

            // Map target language
            const language = targetLanguage === 'auto' ? undefined : targetLanguage;

            // Call YouTube summarization endpoint
            const youtubeApiUrl = `${apiUrl}/youtube`;
            console.log('Calling YouTube Sumwise API:', youtubeApiUrl);
            console.log('Video URL:', videoUrl);
            console.log('Summary length:', summaryLength);
            console.log('Language:', language);

            const response = await fetch(youtubeApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: videoUrl,
                    language: language,
                    summary_length: summaryLength,
                    bullet_points: true // Bullet points ile gönder
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Sumwise YouTube API Error: ${errorData.error || response.statusText}`);
            }

            const data = await response.json();
            console.log('YouTube Sumwise API response:', data);

            return {
                title: `YouTube Video: ${data.video_id}`,
                summary: data.summary,
                sourceUrl: data.video_url
            };
        } catch (error) {
            console.error('YouTube Sumwise API error:', error);
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Failed to connect to Sumwise YouTube API. Make sure the server is running on ' + apiUrl);
            }
            throw new Error(`Failed to summarize YouTube video: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const summarizeWithSumwise = async (content: string, maxCharacters: number, targetLanguage: string, apiUrl: string): Promise<string> => {
        try {
            // Prepare summary length based on character limit
            let summaryLength: 'short' | 'medium' | 'long' = 'medium';
            if (maxCharacters > 0) {
                if (maxCharacters <= 300) {
                    summaryLength = 'short';
                } else if (maxCharacters >= 600) {
                    summaryLength = 'long';
                }
            }

            // Map target language
            const language = targetLanguage === 'auto' ? undefined : targetLanguage;

            console.log('Calling Sumwise API:', apiUrl);
            console.log('Content length:', content.length);
            console.log('Summary length:', summaryLength);
            console.log('Language:', language);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: content,
                    language: language,
                    summary_length: summaryLength,
                    bullet_points: false
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Sumwise API Error: ${errorData.error || response.statusText}`);
            }

            const data = await response.json();
            console.log('Sumwise API response:', data);

            return data.summary;
        } catch (error) {
            console.error('Sumwise API error:', error);
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Failed to connect to Sumwise API. Make sure the server is running on ' + apiUrl);
            }
            throw new Error(`Failed to generate summary with Sumwise: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const summarizeWithAI = async (content: string, maxCharacters: number, targetLanguage: string): Promise<string> => {
        const result = await chrome.storage.local.get(['aiProvider', 'apiKey', 'apiUrl']);
        const aiProvider = result.aiProvider || 'openai';
        const apiKey = result.apiKey;
        const apiUrl = result.apiUrl || 'http://localhost:3000/api/summarize';

        // Route to the correct provider
        if (aiProvider === 'sumwise') {
            return await summarizeWithSumwise(content, maxCharacters, targetLanguage, apiUrl);
        }

        // Default to OpenAI
        if (!apiKey) {
            throw new Error('API key not found. Please set it in the settings.');
        }

        const maxContentLength = 4000;
        const truncatedContent = content.length > maxContentLength
            ? content.substring(0, maxContentLength) + '...'
            : content;

        try {
            let systemMessage = "Create a concise summary of the content highlighting the main ideas and key points.";

            if (targetLanguage !== 'auto' && targetLanguage !== 'en') {
                const languageNames: { [key: string]: string } = {
                    'tr': 'Turkish',
                    'ar': 'Arabic',
                    'de': 'German',
                    'fr': 'French',
                    'it': 'Italian'
                };

                const languageName = languageNames[targetLanguage] || targetLanguage;
                systemMessage += ` Provide the summary in ${languageName}.`;
            }

            if (maxCharacters > 0) {
                systemMessage += ` Limit the summary to maximum ${maxCharacters} characters.`;
            }

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: selectedModel,
                    messages: [
                        {
                            role: "system",
                            content: systemMessage
                        },
                        {
                            role: "user",
                            content: `Summarize this content: ${truncatedContent}`
                        }
                    ],
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            const summaryText = data.choices[0].message.content;

            return summaryText;
        } catch (error) {
            console.error('AI summarization error:', error);
            throw new Error('Failed to generate summary. Please check your API key and try again.');
        }
    };

    const getContentTypeLabel = () => {
        if (autoDetectContent) {
            return contentType === 'webpage'
                ? 'Web Page (Auto-detected)'
                : contentType === 'pdf'
                    ? 'PDF (Auto-detected)'
                    : 'YouTube (Auto-detected)';
        }
        return contentType === 'webpage' ? 'Web Page' : contentType === 'pdf' ? 'PDF' : 'YouTube';
    };

    return (
        <div className="summarize-component">
            <header className="header">
                <h2>AI Summarizer</h2>
                <button className="settings-button" onClick={onBackToSettings}>
                    Settings
                </button>
            </header>

            <div className="provider-info" style={{ 
                padding: '10px', 
                background: aiProvider === 'sumwise' ? '#e8f5e9' : '#e3f2fd', 
                borderRadius: '5px', 
                marginBottom: '15px',
                fontSize: '13px'
            }}>
                <strong>Provider:</strong> {aiProvider === 'sumwise' ? '🚀 Sumwise API (AWS Bedrock + Mistral)' : '🤖 OpenAI'}
            </div>

            {aiProvider === 'openai' && (
                <div className="model-selection">
                    <label htmlFor="model-select">Model:</label>
                    <select
                        id="model-select"
                        value={selectedModel}
                        onChange={handleModelChange}
                        className="model-select"
                    >
                        <option value="gpt-4.1">GPT-4.1</option>
                        <option value="o4-mini">O4 Mini</option>
                        <option value="o3">O3</option>
                        <option value="gpt-4o">GPT-4o</option>
                        <option value="gpt-4o-mini">GPT-4o Mini</option>
                        <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    </select>
                </div>
            )}

            <div className="content-type-selection">
                <label htmlFor="content-type">Content Type:</label>
                <div className="content-type-value">
                    {getContentTypeLabel()}
                    <button
                        className="change-type-button"
                        onClick={() => setAutoDetectContent(false)}
                        title="Change content type"
                    >
                        Change
                    </button>
                </div>
            </div>

            {!autoDetectContent && (
                <div className="content-type-options">
                    <select
                        id="content-type"
                        value={contentType}
                        onChange={handleContentTypeChange}
                        className="content-type-select"
                    >
                        <option value="webpage">Web Page</option>
                        <option value="pdf">PDF File</option>
                        <option value="youtube">YouTube Video</option>
                    </select>
                </div>
            )}

            {!autoDetectContent && contentType === 'pdf' && (
                <div className="file-input-container">
                    <label htmlFor="pdf-file">Upload PDF:</label>
                    <input
                        type="file"
                        id="pdf-file"
                        accept="application/pdf"
                        onChange={handlePdfFileChange}
                        className="file-input"
                    />
                    {pdfFile && <div className="file-name">{pdfFile.name}</div>}
                </div>
            )}

            {!autoDetectContent && contentType === 'youtube' && (
                <div className="youtube-input-container">
                    <label htmlFor="youtube-url">YouTube URL:</label>
                    <input
                        type="text"
                        id="youtube-url"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="youtube-input"
                    />
                </div>
            )}

            <div className="language-selection-container">
                <label htmlFor="language-select">Summary Language:</label>
                <div className="language-dropdown">
                    <div
                        className="selected-language"
                        onClick={toggleLanguageDropdown}
                    >
                        <span className="language-flag">{selectedLanguage.flag}</span>
                        <span className="language-abbr">{selectedLanguage.abbr}</span>
                        <span className="dropdown-arrow">{isLanguageDropdownOpen ? '▲' : '▼'}</span>
                    </div>

                    {isLanguageDropdownOpen && (
                        <div className="language-options">
                            {LANGUAGES.map((lang) => (
                                <div
                                    key={lang.code}
                                    className={`language-option ${selectedLanguage.code === lang.code ? 'selected' : ''}`}
                                    onClick={() => selectLanguage(lang)}
                                >
                                    <span className="language-flag">{lang.flag}</span>
                                    <span className="language-name">{lang.name}</span>
                                    <span className="language-abbr">{lang.abbr}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="character-limit-container">
                <div
                    className={`accordion-header ${isCharLimitOpen ? 'open' : ''}`}
                    onClick={toggleCharLimitAccordion}
                >
                    <span className="accordion-title">Character Limit</span>
                    <span className="accordion-icon"></span>
                </div>

                {isCharLimitOpen && (
                    <div className="accordion-content">
                        <div className="slider-container">
                            <input
                                type="range"
                                id="character-limit"
                                min={MIN_CHAR_LIMIT}
                                max={MAX_CHAR_LIMIT}
                                step="50"
                                value={characterLimit}
                                onChange={handleCharacterLimitChange}
                                className="character-slider"
                            />
                            <div className="slider-value">{characterLimit} characters</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="summarize-container">
                <button
                    className="summarize-button"
                    onClick={handleSummarize}
                    disabled={isLoading || (!autoDetectContent && contentType === 'pdf' && !pdfFile) || (!autoDetectContent && contentType === 'youtube' && !youtubeUrl)}
                >
                    {isLoading ? 'Processing...' : 'Summarize'}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {summary && (
                <div className="summary-result">
                    <h3 className="summary-title">{summary.title}</h3>
                    {summary.sourceUrl && (
                        <a href={summary.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">
                            View Source
                        </a>
                    )}
                    <div className="summary-content">
                        {summary.summary}
                    </div>
                </div>
            )}
        </div>
    );
};

function extractArticleContent() {
    const detectPageLanguage = () => {

        const htmlLang = document.documentElement.lang;
        if (htmlLang && htmlLang.length > 1) {
            return htmlLang.substring(0, 2).toLowerCase();
        }

        const metaLang = document.querySelector('meta[http-equiv="content-language"]');
        if (metaLang && metaLang.getAttribute('content')) {
            return metaLang.getAttribute('content')!.substring(0, 2).toLowerCase();
        }

        return 'auto';
    };

    const getTextContent = () => {
        const article = document.querySelector('article');
        if (article && article instanceof HTMLElement) return article.innerText;

        const main = document.querySelector('main');
        if (main && main instanceof HTMLElement) return main.innerText;

        const contentSelectors = [
            '.content', '.article', '.post', '.post-content',
            '[role="main"]', '#content', '#main', '.main-content'
        ];

        for (const selector of contentSelectors) {
            const element = document.querySelector(selector);
            if (element && element instanceof HTMLElement) return element.innerText;
        }
        const paragraphs = Array.from(document.querySelectorAll('p'));
        const textBlocks = paragraphs
            .filter(p => p instanceof HTMLElement)
            .map(p => (p as HTMLElement).innerText)
            .filter(text => text.length > 100);

        if (textBlocks.length > 0) {
            return textBlocks.join('\n\n');
        }

        return document.body.innerText.slice(0, 5000);
    };

    return {
        title: document.title,
        url: window.location.href,
        content: getTextContent(),
        language: detectPageLanguage()
    };
}

function checkForEmbeddedPdf(): { isEmbeddedPdf: boolean; pdfUrl: string | null } {
    const selectors = [
        'embed[type="application/pdf"]',
        'object[type="application/pdf"]',
        'iframe[src$="\.pdf"]'
    ];
    console.log('[ContentScript checkForEmbeddedPdf] Running selectors:', selectors);

    for (const selector of selectors) {
        const element = document.querySelector(selector) as HTMLIFrameElement | HTMLEmbedElement | HTMLObjectElement | null;
        if (element) {
            let pdfSrc = null;
            if (element.tagName === 'EMBED' || element.tagName === 'IFRAME') {
                pdfSrc = (element as HTMLEmbedElement | HTMLIFrameElement).src;
            } else if (element.tagName === 'OBJECT') {
                pdfSrc = (element as HTMLObjectElement).data;
            }
            console.log(`[ContentScript checkForEmbeddedPdf] Element found for selector ${selector}:`, element, 'potential src:', pdfSrc);

            if (pdfSrc) {
                console.log('[ContentScript checkForEmbeddedPdf] Found potential PDF src attribute:', pdfSrc);
                try {
                    const absoluteUrl = new URL(pdfSrc, window.location.origin).href;
                    console.log('[ContentScript checkForEmbeddedPdf] Resolved to absolute URL:', absoluteUrl);
                    return { isEmbeddedPdf: true, pdfUrl: absoluteUrl };
                } catch (e) {
                    console.warn('[ContentScript checkForEmbeddedPdf] Could not resolve PDF src to absolute URL:', pdfSrc, 'Error:', e);
                    return { isEmbeddedPdf: true, pdfUrl: pdfSrc };
                }
            }
        }
    }
    console.log('[ContentScript checkForEmbeddedPdf] No embedded PDF element found.');
    return { isEmbeddedPdf: false, pdfUrl: null };
}

export default SummarizeComponent; 