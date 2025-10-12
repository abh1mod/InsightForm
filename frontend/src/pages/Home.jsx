import { Link } from "react-router-dom";
import { ArrowRightIcon, UsersIcon, CheckBadgeIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'; 
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'; // Using solid icon for emphasis

// Static data for the stats section
const stats = [
    { id: 1, name: 'Active Monthly Users', value: '10K+', icon: UsersIcon },
    { id: 2, name: 'Forms Generated', value: '50K+', icon: ClipboardDocumentListIcon },
    { id: 3, name: 'Responses Collected', value: '1M+', valueClass: 'text-green-500 dark:text-green-400', icon: CheckBadgeIcon },
];

// Static data for the testimonials/feedback section
const testimonials = [
    {
        id: 1,
        quote: "InsightForm cut our development time by 50%. The clean API and builder made integration trivial. It's the best tool for high-volume data collection.",
        source: "Akshay P.",
        title: "CTO, Data Solutions Inc.",
    },
    {
        id: 2,
        quote: "The dark mode and responsive design are flawless. It feels like a premium enterprise product, but for developers. Absolutely love the minimal UI.",
        source: "Priya V.",
        title: "Senior Product Manager",
    },
    {
        id: 3,
        quote: "We quickly generated complex user surveys without writing a single line of frontend code. The time saved is invaluable. Highly recommended.",
        source: "Karan S.",
        title: "UX Researcher Lead",
    },
];


const Home = () => {
    return (
        <div className="relative isolate overflow-hidden pt-14 pb-24 lg:pb-32 min-h-screen rounded-lg
                        bg-gray-50 dark:bg-gray-900 transition-colors duration-500">

            <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-20">
                
                {/* 1. Hero Section */}
                <div className="mx-auto max-w-3xl text-center pt-10">
                    
                    {/* Pre-title Badge */}
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-all duration-300
                                     bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200 
                                     dark:bg-indigo-900 dark:text-indigo-300 dark:ring-indigo-700">
                        🚀 Launch Your Data Strategy
                    </span>

                    {/* Main Headline */}
                    <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-6xl 
                                   text-gray-900 dark:text-white">
                        Build Smarter Forms,
                        <br className="hidden sm:inline" />
                        Get Deeper Insights.
                    </h1>

                    {/* Subtitle / Description */}
                    <p className="mt-6 text-lg leading-8 
                                  text-gray-600 dark:text-gray-300">
                        InsightForm is the developer-centric platform for lightning-fast data collection. Minimal design, maximal performance, and full control over your data pipeline.
                    </p>

                    {/* Single Call-to-Action Button */}
                    <div className="mt-10 flex items-center justify-center">
                        <Link
                            to="/about"
                            className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3 text-lg font-semibold shadow-lg transition-all duration-300 transform 
                                       bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 
                                       dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-800"
                        >
                            Know about us
                            <ArrowRightIcon className="h-5 w-5" />
                        </Link>
                    </div>
                </div>

                {/* 2. Key Metrics / Stats Section */}
                <div className="mx-auto max-w-6xl">
                    <h2 className="text-3xl font-bold text-center mb-10 
                                   text-gray-900 dark:text-white">
                        Insights by the Numbers
                    </h2>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                        {stats.map((stat) => (
                            <div 
                                key={stat.id} 
                                className="flex flex-col items-center justify-center p-8 rounded-2xl shadow-xl ring-1 
                                            bg-white ring-gray-100 
                                            dark:bg-gray-800 dark:ring-gray-700 transition-shadow duration-300 hover:shadow-2xl"
                            >
                                <stat.icon className="h-10 w-10 mb-3 text-indigo-500 dark:text-indigo-400" />
                                <dd className={`text-4xl font-extrabold tracking-tight ${stat.valueClass || 'text-gray-900 dark:text-white'}`}>
                                    {stat.value}
                                </dd>
                                <dt className="mt-2 text-base font-medium text-gray-500 dark:text-gray-400">
                                    {stat.name}
                                </dt>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. User Feedback / Testimonials Section */}
                <div className="mx-auto max-w-6xl">
                    <h2 className="text-3xl font-bold text-center mb-10 
                                   text-gray-900 dark:text-white">
                        Trusted by Innovators
                    </h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {testimonials.map((t) => (
                            <div 
                                key={t.id} 
                                className="p-6 rounded-2xl shadow-lg ring-1 transition duration-300 
                                            bg-white ring-gray-100 
                                            dark:bg-gray-800 dark:ring-gray-700 hover:shadow-indigo-500/20"
                            >
                                <ChatBubbleLeftRightIcon className="w-8 h-8 text-indigo-400 mb-4" />
                                <blockquote className="text-base italic leading-relaxed 
                                                       text-gray-700 dark:text-gray-300">
                                    "{t.quote}"
                                </blockquote>
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <p className="font-semibold text-gray-900 dark:text-white">{t.source}</p>
                                    <p className="text-sm text-indigo-600 dark:text-indigo-400">{t.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Home;
