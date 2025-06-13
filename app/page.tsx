'use client'

import { motion } from 'framer-motion'
import { Download, LogIn, UserPlus, Sparkles, Zap, Shield, Brain, Badge, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DynamicBackground } from '@/components/DynamicBackground'
import Image from 'next/image'

export default function Home() {
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
                            Summarize Anything
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

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                >
                    <FeatureCard
                        icon={<Zap className="h-6 w-6" />}
                        title="Lightning Fast"
                        description="Get instant summaries with our advanced AI technology"
                    />
                    <FeatureCard
                        icon={<Shield className="h-6 w-6" />}
                        title="Privacy First"
                        description="Your data stays secure and private at all times"
                    />
                    <FeatureCard
                        icon={<Sparkles className="h-6 w-6" />}
                        title="Smart Insights"
                        description="Extract key points and insights automatically"
                    />
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
            className="group relative overflow-hidden rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm transition-colors hover:border-primary/50"
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