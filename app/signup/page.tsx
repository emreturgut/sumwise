'use client'

import { motion } from 'framer-motion'
import { UserPlus, Mail, Lock, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DynamicBackground } from '@/components/DynamicBackground'
import Image from 'next/image'
import Link from 'next/link'

export default function SignUp() {
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
            </nav>

            {/* Sign Up Form */}
            <section className="relative z-10 flex flex-col items-center justify-center px-6 py-24 text-center lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8">
                        <div className="mb-8">
                            <h1 className="mb-2 text-3xl font-bold">
                                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                    Create Account
                                </span>
                            </h1>
                            <p className="text-muted-foreground">
                                Start your journey with Sumwise AI
                            </p>
                        </div>

                        <form className="space-y-6">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Email"
                                        className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm Password"
                                        className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-start space-x-2 text-sm">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="w-4 h-4 mt-1 rounded border-border text-purple-400 focus:ring-purple-400"
                                    required
                                />
                                <label htmlFor="terms" className="text-muted-foreground text-left">
                                    I agree to the{' '}
                                    <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                                        Privacy Policy
                                    </a>
                                </label>
                            </div>

                            <Button type="submit" size="lg" className="w-full group">
                                <UserPlus className="mr-2 h-5 w-5" />
                                Create Account
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-muted-foreground">
                                Already have an account?{' '}
                                <Link href="/signin" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </div>

                        <Link href="/" className="flex items-center justify-center space-x-2 group mt-6">
                            <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:text-purple-400 transition-colors" />
                            <span className="text-muted-foreground group-hover:text-purple-400 transition-colors">Back to Home</span>
                        </Link>
                    </div>
                </motion.div>
            </section>
        </main>
    )
} 