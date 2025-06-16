'use client'

import { motion } from 'framer-motion'
import { Download, LogIn, UserPlus, Sparkles, Zap, Shield, Brain, Badge, Star, Clock, Quote, Chrome, Mail, Linkedin, Twitter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DynamicBackground } from '@/components/DynamicBackground'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import FeaturesAnimation from '@/components/features-animation'
import Link from 'next/link'

export default function Home() {
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [displayText, setDisplayText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const words = ['Anything', 'Articles', 'Videos', 'Web Pages', 'Documents']

    useEffect(() => {
        const currentWord = words[currentWordIndex]

        const timeout = setTimeout(() => {
            if (!isDeleting && displayText === currentWord) {
                setTimeout(() => setIsDeleting(true), 1500)
            } else if (isDeleting && displayText === '') {
                setIsDeleting(false)
                setCurrentWordIndex((prev) => (prev + 1) % words.length)
            } else if (!isDeleting) {
                setDisplayText(currentWord.substring(0, displayText.length + 1))
            } else {
                setDisplayText(currentWord.substring(0, displayText.length - 1))
            }
        }, isDeleting ? 50 : 100)
        return () => clearTimeout(timeout)
    }, [displayText, isDeleting, currentWordIndex, words])
    return (
        <main className="relative min-h-screen overflow-hidden">
            <DynamicBackground />

            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center space-x-2"
                >
                    <div className="relative h-8 w-8">
                        <Image src="/icon.svg" alt="Sumwise" fill className="object-contain" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Sumwise
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center space-x-4"
                >
                    <Link href="/signin">
                        <Button variant="ghost" size="sm">
                            Sign In
                        </Button>
                    </Link>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 flex flex-col items-center justify-center px-6 py-24 text-center lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl"
                >
                    <div className="mb-1 bg-gray-800 text-purple-400 border-purple-300/20 rounded-full px-4 py-1 flex items-center w-fit mx-auto hover:bg-gray-700 transition-colors">
                        <Star className="text-purple-400 h-4 w-4 mr-1" />
                        <span className="text-sm">AI-Powered Summarization</span>
                    </div>
                    <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-7xl">
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                            Summarize{' '}
                            <span className="">
                                {displayText}
                                <span className="animate-pulse">|</span>
                            </span>
                        </span>
                        <br />
                        <span className="text-foreground">In Seconds</span>
                    </h1>

                    <p className="mb-8 text-lg text-muted-foreground lg:text-xl">
                        Transform lengthy articles, documents, and web pages into concise,
                        intelligent summaries with our AI-powered browser extension.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                    >
                        <Button size="lg" className="group">
                            <Download className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-1" />
                            Download Extension
                        </Button>
                        <Link href="/signup">
                            <Button size="lg" variant="outline">
                                Get Started Free
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Why Choose Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-20 text-center"
                >
                    <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
                        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Why Choose Sumwise AI?
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Experience the future of content consumption with our intelligent summarization technology designed for the modern digital world.
                    </p>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    <FeatureCard
                        icon={<Zap className="h-6 w-6" />}
                        title="Lightning Fast"
                        description="Get instant summaries of any content with our optimized AI models. No waiting, no delays - just immediate results."
                    />
                    <FeatureCard
                        icon={<Clock className="h-6 w-6" />}
                        title="Save Time"
                        description="Reduce reading time by up to 80%. Focus on what matters most while staying informed about everything else."
                    />
                    <FeatureCard
                        icon={<Sparkles className="h-6 w-6" />}
                        title="Smart Insights"
                        description="Go beyond basic summaries. Our AI identifies key themes, actionable insights, and hidden patterns to give you deeper understanding of any content."
                    />
                </motion.div>

                <FeaturesAnimation />

                {/* Testimonials Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mt-20"
                >
                    <div className="text-center mb-12">
                        <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
                            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                What Our Users Say
                            </span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Join thousands of professionals who have transformed their reading experience with Sumwise AI.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3 max-w-6xl mx-auto">
                        <TestimonialCard
                            quote="I no longer spend hours reading code documentation and technical articles. I can capture the main points in minutes and focus on actual coding."
                            author="Senior Software Developer"
                            role="Tech Company"
                            company="Tech Company"
                        />
                        <TestimonialCard
                            quote="Creating marketing strategies requires reading tons of articles and reports. With Sumwise, I can quickly extract trend analysis and key insights for campaigns."
                            author="Marketing Specialist"
                            role="Digital Agency"
                            company="Digital Agency"
                        />
                        <TestimonialCard
                            quote="My research projects require scanning dozens of sources. This tool helps me quickly grasp the essence of each source and focus on my actual work."
                            author="Business Analyst"
                            role="Financial Institution"
                            company="Financial Institution"
                        />
                    </div>
                </motion.div>

                {/* Browser Extension Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-20 text-center"
                >
                    <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
                        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Get the Browser Extension
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Install Sumwise directly in your browser and summarize any webpage with just one click. Available now for Chrome, with more browsers coming soon.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button size="lg" className="group w-64">
                            <Chrome className="mr-2 h-5 w-5" />
                            Add to Chrome
                            <Download className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-1" />
                        </Button>
                        <Button size="lg" variant="outline" disabled className="w-64 opacity-50 cursor-not-allowed">
                            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                                <path d="M12 6c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 10c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" />
                            </svg>
                            Firefox - Coming Soon
                        </Button>
                    </div>
                </motion.div>

                {/* Ready to Transform Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="mt-20 text-center bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-8 border border-purple-300/20"
                >
                    <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
                        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Ready to Transform Your Content Experience?
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Join thousands of professionals who save hours every day with intelligent AI summarization. Start your journey to more efficient content consumption today.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link href="/signup">
                            <Button size="lg" className="group w-48">
                                <Star className="mr-2 h-5 w-5" />
                                Start Free Trial
                            </Button>
                        </Link>
                        <Link href="/signin">
                            <Button size="lg" variant="outline" className="w-48">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 bg-gray-900/50 backdrop-blur-sm border-t border-gray-800 mt-20">
                <div className="max-w-7xl mx-auto px-6 py-12 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Section - Logo & Social */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-2">
                                <div className="relative h-8 w-8">
                                    <Image src="/icon.svg" alt="Sumwise" fill className="object-contain" />
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                    Sumwise AI
                                </span>
                            </div>
                            <p className="text-muted-foreground max-w-sm">
                                Transform your content consumption with AI-powered summarization. Save time, stay informed, and focus on what matters most.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.082.082 0 0 0 .031.056 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 14.23 14.23 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.246.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                                    <X className="h-6 w-6" />
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                                    <Linkedin className="h-6 w-6" />
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                                    <Mail className="h-6 w-6" />
                                </a>
                            </div>
                        </div>

                        {/* Middle Section - Product */}
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">Product</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                                        Blog
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Right Section - Support */}
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">Support</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                                        Terms of Service
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Section - Copyright */}
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                        <p className="text-muted-foreground">
                            © 2025 Sumwise AI. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    )
}

function FeatureCard({ icon, title, description }: {
    icon: React.ReactNode
    title: string
    description: string
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-80 group relative overflow-hidden rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm transition-colors hover:border-primary/50"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative z-10">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                    {icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </motion.div>
    )
}

function TestimonialCard({ quote, author, role, company }: {
    quote: string
    author: string
    role: string
    company: string
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm transition-colors hover:border-primary/50"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative z-10">
                <Quote className="h-8 w-8 text-primary/60 mb-4" />
                <p className="text-foreground mb-6 italic leading-relaxed">
                    "{quote}"
                </p>
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-white font-semibold mr-3">
                        {author[0]}
                    </div>
                    <div>
                        <p className="font-semibold text-foreground">{author}</p>
                        <p className="text-sm text-muted-foreground">{role}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
} 