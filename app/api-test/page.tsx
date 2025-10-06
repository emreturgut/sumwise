'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ApiTest() {
    const [results, setResults] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState<Record<string, boolean>>({})

    const testEndpoint = async (endpoint: string, method: string = 'GET', data?: any) => {
        setLoading(prev => ({ ...prev, [endpoint]: true }))

        try {
            const options: RequestInit = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            if (data) {
                options.body = JSON.stringify(data)
            }

            const response = await fetch(`/api/${endpoint}`, options)
            const result = await response.json()

            setResults(prev => ({
                ...prev,
                [endpoint]: {
                    status: response.status,
                    data: result,
                    timestamp: new Date().toISOString()
                }
            }))
        } catch (error) {
            setResults(prev => ({
                ...prev,
                [endpoint]: {
                    status: 'Error',
                    data: { error: error instanceof Error ? error.message : 'Unknown error' },
                    timestamp: new Date().toISOString()
                }
            }))
        } finally {
            setLoading(prev => ({ ...prev, [endpoint]: false }))
        }
    }

    const testData = {
        signin: {
            email: 'demo@sumwise.ai',
            password: 'demo123'
        },
        signup: {
            email: 'test@example.com',
            password: 'test123',
            confirmPassword: 'test123'
        },
        test: {
            message: 'Hello from test!'
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href="/" className="flex items-center space-x-2 group mb-4 w-fit">
                        <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
                        <span className="text-gray-600 group-hover:text-purple-600 transition-colors">Back to Home</span>
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        API Test Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Test the Sumwise backend API endpoints
                    </p>
                </div>

                <div className="grid gap-6">
                    {/* Health Check */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                        <h2 className="text-xl font-semibold mb-4">Health Check</h2>
                        <div className="space-y-4">
                            <Button
                                onClick={() => testEndpoint('health')}
                                disabled={loading.health}
                                className="mr-4"
                            >
                                {loading.health ? 'Testing...' : 'Test Health Endpoint'}
                            </Button>

                            {results.health && (
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <div className="text-sm font-mono">
                                        <div className="mb-2">
                                            <span className="font-semibold">Status:</span> {results.health.status}
                                        </div>
                                        <pre className="whitespace-pre-wrap overflow-auto">
                                            {JSON.stringify(results.health.data, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Auth Endpoints */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                        <h2 className="text-xl font-semibold mb-4">Authentication</h2>
                        <div className="space-y-6">
                            {/* Sign In */}
                            <div>
                                <h3 className="font-medium mb-2">Sign In</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    Test credentials: demo@sumwise.ai / demo123
                                </p>
                                <Button
                                    onClick={() => testEndpoint('auth/signin', 'POST', testData.signin)}
                                    disabled={loading['auth/signin']}
                                    className="mr-4"
                                >
                                    {loading['auth/signin'] ? 'Testing...' : 'Test Sign In'}
                                </Button>

                                {results['auth/signin'] && (
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
                                        <div className="text-sm font-mono">
                                            <div className="mb-2">
                                                <span className="font-semibold">Status:</span> {results['auth/signin'].status}
                                            </div>
                                            <pre className="whitespace-pre-wrap overflow-auto">
                                                {JSON.stringify(results['auth/signin'].data, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sign Up */}
                            <div>
                                <h3 className="font-medium mb-2">Sign Up</h3>
                                <Button
                                    onClick={() => testEndpoint('auth/signup', 'POST', testData.signup)}
                                    disabled={loading['auth/signup']}
                                    className="mr-4"
                                >
                                    {loading['auth/signup'] ? 'Testing...' : 'Test Sign Up'}
                                </Button>

                                {results['auth/signup'] && (
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
                                        <div className="text-sm font-mono">
                                            <div className="mb-2">
                                                <span className="font-semibold">Status:</span> {results['auth/signup'].status}
                                            </div>
                                            <pre className="whitespace-pre-wrap overflow-auto">
                                                {JSON.stringify(results['auth/signup'].data, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Test Endpoint */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                        <h2 className="text-xl font-semibold mb-4">Test Endpoints</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => testEndpoint('test')}
                                    disabled={loading.test}
                                    variant="outline"
                                >
                                    {loading.test ? 'Testing...' : 'Test GET'}
                                </Button>

                                <Button
                                    onClick={() => testEndpoint('test', 'POST', testData.test)}
                                    disabled={loading['test-post']}
                                    variant="outline"
                                >
                                    {loading['test-post'] ? 'Testing...' : 'Test POST'}
                                </Button>
                            </div>

                            {(results.test || results['test-post']) && (
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <div className="text-sm font-mono">
                                        {results.test && (
                                            <div className="mb-4">
                                                <div className="font-semibold mb-2">GET /api/test:</div>
                                                <div className="mb-2">Status: {results.test.status}</div>
                                                <pre className="whitespace-pre-wrap overflow-auto">
                                                    {JSON.stringify(results.test.data, null, 2)}
                                                </pre>
                                            </div>
                                        )}

                                        {results['test-post'] && (
                                            <div>
                                                <div className="font-semibold mb-2">POST /api/test:</div>
                                                <div className="mb-2">Status: {results['test-post'].status}</div>
                                                <pre className="whitespace-pre-wrap overflow-auto">
                                                    {JSON.stringify(results['test-post'].data, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 