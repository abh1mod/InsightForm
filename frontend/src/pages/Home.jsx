import { Link } from "react-router-dom";
import { useAppContext } from "../context/ContextAPI";

const Home = () => {
    const { isLoggedIn } = useAppContext();

    const getStartedLink = isLoggedIn ? "/dashboard" : "/login";

    return (
        <div className="min-h-screen w-full overflow-x-hidden">
            {/* Hero Section with Background */}
            <section className="relative min-h-screen flex items-center justify-center bg-gray-50 w-full">
                {/* Exact Background Pattern from Image */}
                <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-gray-50 to-blue-50">
                    {/* Smart Forms Feature - Top Left */}
                    <div className="absolute top-16 left-12 w-32 h-32 opacity-20">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            {/* Document outline */}
                            <rect x="20" y="20" width="120" height="140" rx="8" fill="none" stroke="#60a5fa" strokeWidth="2"/>
                            <line x1="30" y1="40" x2="130" y2="40" stroke="#60a5fa" strokeWidth="1.5"/>
                            <line x1="30" y1="60" x2="110" y2="60" stroke="#60a5fa" strokeWidth="1.5"/>
                            <line x1="30" y1="80" x2="120" y2="80" stroke="#60a5fa" strokeWidth="1.5"/>
                            {/* Circuit board overlay */}
                            <rect x="100" y="100" width="40" height="40" fill="#60a5fa" opacity="0.3"/>
                            <rect x="110" y="110" width="20" height="20" fill="#60a5fa" opacity="0.6"/>
                            <line x1="110" y1="110" x2="130" y2="110" stroke="#60a5fa" strokeWidth="1"/>
                            <line x1="110" y1="130" x2="130" y2="130" stroke="#60a5fa" strokeWidth="1"/>
                            <line x1="110" y1="110" x2="110" y2="130" stroke="#60a5fa" strokeWidth="1"/>
                            <line x1="130" y1="110" x2="130" y2="130" stroke="#60a5fa" strokeWidth="1"/>
                        </svg>
                        <div className="text-center mt-2">
                            <span className="text-sm font-medium text-gray-700">Smart Forms</span>
                        </div>
                    </div>
                    
                    {/* Statistics Feature - Bottom Left */}
                    <div className="absolute bottom-24 left-12 w-32 h-32 opacity-20">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            {/* Speech bubble */}
                            <ellipse cx="40" cy="60" rx="20" ry="15" fill="#fbbf24" opacity="0.7"/>
                            <path d="M30 70 L20 80 L35 75 Z" fill="#fbbf24" opacity="0.7"/>
                            {/* Bar chart */}
                            <rect x="60" y="120" width="12" height="50" fill="#86efac"/>
                            <rect x="75" y="100" width="12" height="70" fill="#93c5fd"/>
                            <rect x="90" y="80" width="12" height="90" fill="#c4b5fd"/>
                            <line x1="50" y1="180" x2="110" y2="180" stroke="#6b7280" strokeWidth="1.5"/>
                            {/* Magnifying glass */}
                            <circle cx="130" cy="100" r="15" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                            <line x1="140" y1="110" x2="150" y2="120" stroke="#3b82f6" strokeWidth="2"/>
                            {/* Triangle */}
                            <path d="M160 140 L170 120 L180 140 Z" fill="#c4b5fd" opacity="0.7"/>
                        </svg>
                        <div className="text-center mt-2">
                            <span className="text-sm font-medium text-gray-700">Statistics</span>
                        </div>
                    </div>
                    
                    {/* AI-Powered Analytics Feature - Top Right */}
                    <div className="absolute top-16 right-12 w-32 h-32 opacity-20">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            {/* Line graph with grid */}
                            <line x1="20" y1="160" x2="40" y2="140" stroke="#f87171" strokeWidth="3"/>
                            <line x1="40" y1="140" x2="60" y2="120" stroke="#f87171" strokeWidth="3"/>
                            <line x1="60" y1="120" x2="80" y2="100" stroke="#f87171" strokeWidth="3"/>
                            <line x1="80" y1="100" x2="100" y2="80" stroke="#f87171" strokeWidth="3"/>
                            <line x1="100" y1="80" x2="120" y2="60" stroke="#f87171" strokeWidth="3"/>
                            <line x1="120" y1="60" x2="140" y2="40" stroke="#f87171" strokeWidth="3"/>
                            <line x1="140" y1="40" x2="160" y2="20" stroke="#f87171" strokeWidth="3"/>
                            {/* Grid lines */}
                            <line x1="20" y1="160" x2="160" y2="160" stroke="#d1d5db" strokeWidth="1"/>
                            <line x1="20" y1="20" x2="20" y2="160" stroke="#d1d5db" strokeWidth="1"/>
                            {/* Data points */}
                            <circle cx="40" cy="140" r="3" fill="#f87171"/>
                            <circle cx="60" cy="120" r="3" fill="#f87171"/>
                            <circle cx="80" cy="100" r="3" fill="#f87171"/>
                            <circle cx="100" cy="80" r="3" fill="#f87171"/>
                            <circle cx="120" cy="60" r="3" fill="#f87171"/>
                            <circle cx="140" cy="40" r="3" fill="#f87171"/>
                            {/* Brain icon */}
                            <path d="M120 100 C130 90, 140 90, 150 100 C140 110, 130 110, 120 100" fill="#fca5a5" stroke="#f87171" strokeWidth="2"/>
                        </svg>
                        <div className="text-center mt-2">
                            <span className="text-sm font-medium text-gray-700">AI-Powered Analytics</span>
                        </div>
                    </div>
                    
                    {/* Actionable Insights Feature - Bottom Right */}
                    <div className="absolute bottom-24 right-12 w-32 h-32 opacity-20">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            {/* Lightbulb */}
                            <ellipse cx="100" cy="80" rx="25" ry="35" fill="#fde047" stroke="#f59e0b" strokeWidth="2"/>
                            <rect x="90" y="110" width="20" height="15" fill="#3b82f6"/>
                            <rect x="95" y="125" width="10" height="5" fill="#3b82f6"/>
                            {/* Light rays */}
                            <path d="M60 60 L70 50 L80 60" stroke="#fde047" strokeWidth="2" fill="none"/>
                            <path d="M120 60 L130 50 L140 60" stroke="#fde047" strokeWidth="2" fill="none"/>
                            <path d="M60 100 L50 90 L60 80" stroke="#fde047" strokeWidth="2" fill="none"/>
                            <path d="M140 100 L150 90 L140 80" stroke="#fde047" strokeWidth="2" fill="none"/>
                            {/* Circular arrows */}
                            <path d="M70 100 A30 30 0 0 1 130 100" stroke="#3b82f6" strokeWidth="3" fill="none" strokeDasharray="5,5"/>
                            <path d="M130 100 A30 30 0 0 1 70 100" stroke="#3b82f6" strokeWidth="3" fill="none" strokeDasharray="5,5"/>
                            {/* Arrow heads */}
                            <path d="M65 95 L70 100 L65 105" stroke="#3b82f6" strokeWidth="2" fill="none"/>
                            <path d="M135 105 L130 100 L135 95" stroke="#3b82f6" strokeWidth="2" fill="none"/>
                        </svg>
                        <div className="text-center mt-2">
                            <span className="text-sm font-medium text-gray-700">Actionable Insights</span>
                        </div>
                    </div>
                    
                    {/* Subtle background doodles */}
                    <div className="absolute top-1/3 left-1/3 w-16 h-16 opacity-5">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <circle cx="50" cy="50" r="3" fill="#9ca3af"/>
                            <circle cx="80" cy="60" r="3" fill="#9ca3af"/>
                            <circle cx="110" cy="40" r="3" fill="#9ca3af"/>
                            <circle cx="140" cy="70" r="3" fill="#9ca3af"/>
                            <line x1="50" y1="50" x2="80" y2="60" stroke="#9ca3af" strokeWidth="1"/>
                            <line x1="80" y1="60" x2="110" y2="40" stroke="#9ca3af" strokeWidth="1"/>
                            <line x1="110" y1="40" x2="140" y2="70" stroke="#9ca3af" strokeWidth="1"/>
                        </svg>
                    </div>
                    
                    <div className="absolute bottom-1/3 right-1/3 w-12 h-12 opacity-5">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <rect x="40" y="40" width="20" height="20" fill="#9ca3af" opacity="0.5"/>
                            <rect x="70" y="70" width="20" height="20" fill="#9ca3af" opacity="0.5"/>
                            <rect x="100" y="50" width="20" height="20" fill="#9ca3af" opacity="0.5"/>
                        </svg>
                    </div>
                    
                    <div className="absolute top-1/2 right-1/4 w-8 h-8 opacity-5">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <path d="M50 50 L60 40 L70 50 L60 60 Z" fill="#9ca3af"/>
                            <path d="M80 80 L90 70 L100 80 L90 90 Z" fill="#9ca3af"/>
                        </svg>
                    </div>
                    
                    <div className="absolute bottom-1/2 left-1/4 w-10 h-10 opacity-5">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <circle cx="50" cy="50" r="4" fill="#9ca3af"/>
                            <circle cx="80" cy="80" r="4" fill="#9ca3af"/>
                            <circle cx="110" cy="60" r="4" fill="#9ca3af"/>
                            <line x1="50" y1="50" x2="80" y2="80" stroke="#9ca3af" strokeWidth="1"/>
                            <line x1="80" y1="80" x2="110" y2="60" stroke="#9ca3af" strokeWidth="1"/>
                        </svg>
                    </div>
                    
                    {/* Checkmark */}
                    <div className="absolute top-1/4 right-1/3 w-6 h-6 opacity-5">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <path d="M30 100 L50 120 L80 80" stroke="#9ca3af" strokeWidth="3" fill="none"/>
                        </svg>
                    </div>
                    
                    {/* Arrow */}
                    <div className="absolute bottom-1/4 left-1/2 w-6 h-6 opacity-5">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <path d="M50 120 L50 80 L30 100 L50 120 L70 100 Z" fill="#9ca3af"/>
                        </svg>
                    </div>
                    
                    {/* Star */}
                    <div className="absolute bottom-8 right-8 w-4 h-4 opacity-5">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <path d="M100 20 L110 80 L170 80 L120 120 L140 180 L100 140 L60 180 L80 120 L30 80 L90 80 Z" fill="#9ca3af"/>
                        </svg>
                    </div>
                </div>
                
                <div className="w-full px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <div className="text-center">
                        {/* Logo */}
                        <div className="flex justify-center mb-8">
                            <div className="h-24 w-24 rounded-2xl bg-gray-50 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-3xl font-bold shadow-2xl">
                                IF
                            </div>
                        </div>
                        
                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                            InsightForm
                        </h1>
                        
                        {/* Description */}
                        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Transform your data collection with intelligent forms powered by AI. 
                            Create, analyze, and optimize surveys that deliver actionable insights.
                        </p>
                        
                        {/* Get Started Button */}
                        <Link
                            to={getStartedLink}
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                        >
                            Get Started
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Companies Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-16">
                        Trusted by Leading Companies
                    </h2>
                    
                    {/* Major Company Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
                        {/* Company 1 - TechCorp */}
                        <div className="bg-white rounded-2xl p-5 sm:p-6 lg:p-8 shadow-lg transition-shadow duration-300 border border-gray-100">
                            <div className="flex items-center mb-6">
                                <div className="h-16 w-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                    TC
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-bold text-gray-900">TechCorp</h3>
                                    <p className="text-gray-600">Technology Solutions</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">
                                "InsightForm revolutionized our customer feedback process. The AI-powered analysis 
                                helped us increase response rates by 40% and gain deeper insights into user behavior."
                            </p>
                            <div className="flex text-yellow-400 mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>

                        {/* Company 2 - DataFlow */}
                        <div className="bg-white rounded-2xl p-5 sm:p-6 lg:p-8 shadow-lg transition-shadow duration-300 border border-gray-100">
                            <div className="flex items-center mb-6">
                                <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                    DF
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-bold text-gray-900">DataFlow</h3>
                                    <p className="text-gray-600">Analytics Platform</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">
                                "The advanced survey features and real-time analytics have transformed how we 
                                collect and process data. Our team productivity increased by 60%."
                            </p>
                            <div className="flex text-yellow-400 mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>

                        {/* Company 3 - InnovateLab */}
                        <div className="bg-white rounded-2xl p-5 sm:p-6 lg:p-8 shadow-lg transition-shadow duration-300 border border-gray-100">
                            <div className="flex items-center mb-6">
                                <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                    IL
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-bold text-gray-900">InnovateLab</h3>
                                    <p className="text-gray-600">Research & Development</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">
                                "InsightForm's intelligent form builder and automated analysis features 
                                have streamlined our research processes and improved data quality significantly."
                            </p>
                            <div className="flex text-yellow-400 mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Company Strip */}
                    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-none sm:rounded-xl shadow-none sm:shadow-lg border-t sm:border border-gray-100 w-full">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 text-center">
                            And many more trusted partners
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 place-items-center">
                            {['CloudTech', 'DataSync', 'FormPro', 'SurveyMax', 'AnalyticsHub', 'ResearchCorp', 'DataVault', 'InsightLab'].map((company, index) => (
                                <div key={index} className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2">
                                    <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                                        {company.charAt(0)}
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">{company}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">
                        What InsightForm Helps You Do
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: 'Advanced Survey Creation', desc: 'Build sophisticated surveys with conditional logic, multiple question types, and custom styling to capture the data you need.', icon: (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            ) },
                            { title: 'AI-Powered Forms', desc: 'Leverage AI to optimize form design, predict user behavior, and automatically improve question flow for better responses.', icon: (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            ) },
                            { title: 'Smart Analytics', desc: 'Get instant insights with real-time analytics, automated reports, and data visualization tools for informed decisions.', icon: (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            ) },
                            { title: 'Real-time Collaboration', desc: 'Work together with team members, share forms, and collaborate on data analysis in real time.', icon: (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 009.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            ) },
                            { title: 'Enterprise Security', desc: 'Bank-level encryption, GDPR compliance, and advanced security to protect your data.', icon: (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            ) },
                            { title: 'Custom Integrations', desc: 'Connect with your favorite tools via our API and pre-built integrations.', icon: (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            ) },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-xl p-5 shadow-lg transition-shadow duration-200 border border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {item.icon}
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                                        <p className="text-sm text-gray-600">{item.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))} 
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-blue-600 border-t border-blue-500 w-full mt-8">
                <div className="w-full py-10 px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-12 w-12 rounded-xl bg-white text-blue-900 flex items-center justify-center text-xl font-bold">
                                    IF
                                </div>
                                <span className="text-2xl font-bold">InsightForm</span>
                            </div>
                            <p className="text-gray-100 mb-6 max-w-md">
                                Transform your data collection with intelligent forms powered by AI. 
                                Create, analyze, and optimize surveys that deliver actionable insights.
                            </p>
                            
                            {/* Social Media */}
                            <div>
                                <h3 className="text-gray-100 text-lg font-semibold mb-4">Follow Us</h3>
                                <div className="flex gap-4">
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                                       className="h-10 w-10 bg-white hover:bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center transition-colors shadow-sm">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                        </svg>
                                    </a>
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                                       className="h-10 w-10 bg-white hover:bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center transition-colors shadow-sm">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                        </svg>
                                    </a>
                                    <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                                       className="h-10 w-10 bg-white hover:bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center transition-colors shadow-sm">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                        </svg>
                                    </a>
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                                       className="h-10 w-10 bg-white hover:bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center transition-colors shadow-sm">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg text-gray-100 font-semibold mb-4">Contact Us</h3>
                            <div className="space-y-3 text-gray-600">
                                <div className="text-gray-100 flex items-center gap-3">
                                    <svg className="h-5 w-5 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="text-gray-100 flex items-center gap-3">
                                    <svg className="h-5 w-5 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>hello@insightform.com</span>
                                </div>
                                <div className="text-gray-100 flex items-center gap-3">
                                    <svg className="h-5 w-5 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Brahmagiri Hostel, Mangalore, NITK</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-gray-100 text-lg font-semibold mb-4">Quick Links</h3>
                            <div className="space-y-3">
                                <Link to="/about" className="block text-gray-100 hover:text-gray-900 transition-colors">About Us</Link>
                                <Link to="/contact" className="block text-gray-100 hover:text-gray-900 transition-colors">Contact</Link>
                                <Link to="/login" className="block text-gray-100 hover:text-gray-900 transition-colors">Login</Link>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-100">
                        <p>&copy; 2025 InsightForm. All rights reserved. | Privacy Policy | Terms of Service</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
