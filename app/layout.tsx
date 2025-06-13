import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Sumwise - Intelligent Content Summarization',
    description: 'Transform lengthy content into concise, meaningful summaries with Sumwise AI-powered summarizer',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} bg-background text-foreground`}>
                {children}
            </body>
        </html>
    )
} 