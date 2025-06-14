'use client'

import { motion } from 'framer-motion'
import { Download, LogIn, UserPlus, Sparkles, Zap, Shield, Brain, Badge, Star, Clock, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DynamicBackground } from '@/components/DynamicBackground'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import FeaturesAnimation from '@/components/features-animation'

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
                    <Button variant="ghost" size="sm">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                    </Button>
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
                        <Button size="lg" variant="outline">
                            Get Started Free
                        </Button>
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
            </section>
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