# Sumwise

A modern web application for AI-powered content summarization with a beautiful dark theme and dynamic background animations.

## Features

- 🚀 Lightning-fast AI summarization
- 🎨 Beautiful dark theme with dynamic animated background
- 🔒 Privacy-first approach
- ✨ Smart insights extraction
- 📱 Fully responsive design
- 🌐 Browser extension support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Package Manager**: pnpm
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (install with `npm install -g pnpm`)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `pnpm dev` - Start development server with Turbo
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Project Structure

```
sumwise/
├── app/              # Next.js app directory
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Landing page
│   └── globals.css   # Global styles
├── components/       # React components
│   ├── ui/          # UI components
│   └── DynamicBackground.tsx
├── lib/             # Utility functions
├── public/          # Static assets
└── package.json     # Dependencies
```

## License

MIT 