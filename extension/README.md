# AI Chrome Extension

A Chrome extension built with React, TypeScript, and Vite.

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` folder from this project

The extension will automatically reload when you make changes to the code.

## Building for Production

To create a production build:

```bash
npm run build
```

The built extension will be in the `dist` folder.

## Project Structure

- `src/popup/` - Popup UI components
- `src/background/` - Background script
- `src/contentScript/` - Content script that runs on web pages
- `src/static/` - Static assets and manifest.json

## Features

- React 18 with TypeScript
- Fast HMR with Vite
- Production build optimization
- Modern Chrome extension (Manifest V3)
- @crxjs/vite-plugin for seamless extension development 