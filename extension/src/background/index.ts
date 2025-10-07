function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

const tabContentTypes: { [tabId: number]: string } = {};

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message from popup/content script:', message);
    if (message.type === 'GET_CONTENT_TYPE') {
        if (message.tabId) {
            const contentType = tabContentTypes[message.tabId] || 'application/octet-stream';
            console.log(`Sending content type for tab ${message.tabId}: ${contentType}`);
            sendResponse({ contentType });
        } else {
            console.warn('GET_CONTENT_TYPE message received without tabId');
            sendResponse({ contentType: 'application/octet-stream' });
        }
        return true;
    } else if (message.type === 'FETCH_PDF_ARRAY_BUFFER_FROM_URL') {
        if (!message.url) {
            console.error('FETCH_PDF_ARRAY_BUFFER_FROM_URL: URL is missing');
            sendResponse({ error: 'URL is missing' });
            return false;
        }

        const pdfUrl = message.url;
        console.log(`Background: Fetching PDF for Base64 conversion from URL: ${pdfUrl}`);

        fetch(pdfUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
                }
                return response.arrayBuffer();
            })
            .then(arrayBuffer => {
                console.log(`Background: PDF ArrayBuffer received from ${pdfUrl}. Size: ${arrayBuffer.byteLength}`);
                const base64String = arrayBufferToBase64(arrayBuffer);
                console.log(`Background: Converted ArrayBuffer to Base64. Length: ${base64String.length}`);
                sendResponse({ base64PdfData: base64String });
            })
            .catch(error => {
                console.error(`Background: Error fetching/converting PDF from URL ${pdfUrl}:`, error);
                sendResponse({ error: error.message || 'Failed to process PDF for Base64 conversion' });
            });
        return true;
    }
    return false;
});

chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
        if (details.tabId >= 0 && details.type === 'main_frame' && details.responseHeaders) {
            console.log('details', details);
            const contentTypeHeader = details.responseHeaders.find(
                (header) => header.name.toLowerCase() === 'content-type'
            );
            if (contentTypeHeader && contentTypeHeader.value) {
                tabContentTypes[details.tabId] = contentTypeHeader.value;
                console.log(`Stored Content-Type for tab ${details.tabId}: ${contentTypeHeader.value}`);
            }
        }
    },
    { urls: ["<all_urls>"], types: ["main_frame"] },
    ["responseHeaders"]
);

chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabContentTypes[tabId]) {
        delete tabContentTypes[tabId];
        console.log(`Cleaned up Content-Type for removed tab ${tabId}`);
    }
}); 