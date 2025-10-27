import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, CodeBracketIcon, BoltIcon, SunIcon, MoonIcon, 
  ServerStackIcon, CloudArrowUpIcon, FingerPrintIcon, RocketLaunchIcon, 
  PuzzlePieceIcon, ShieldCheckIcon, AdjustmentsHorizontalIcon, GlobeAltIcon 
} from '@heroicons/react/24/outline';

// Data for the developer team - ADDED 'photoUrl' field
const developers = [
  { name: "Abhishek", role: "Full Stack Developer", initials: "A", photoUrl: "https://placehold.co/128x128/f0f9ff/1e3a8a?text=A" },
  { name: "Anubhav Srivastava", role: "Frontend Developer", initials: "AS", photoUrl: "https://placehold.co/128x128/f0f9ff/1e3a8a?text=AS" },
  { name: "Kushagra Singh", role: "Frontend Developer", initials: "KS", photoUrl: "https://placehold.co/128x128/f0f9ff/1e3a8a?text=KS" },
  { name: "Naveen Vashishtha", role: "Full Stack Developer", initials: "NV", photoUrl: "https://placehold.co/128x128/f0f9ff/1e3a8a?text=NV" },
];

// Data for the NEW Core Capabilities section (replacing Technology Stack)
const coreCapabilities = [
  { name: "Intelligent Form Logic", description: "Design dynamic forms that adapt in real-time based on user input for a personalized experience.", icon: PuzzlePieceIcon, color: "text-blue-500", bg: "bg-blue-50" },
  { name: "Enterprise-Grade Security", description: "All data is encrypted in transit and at rest, complying with global data protection standards.", icon: ShieldCheckIcon, color: "text-teal-500", bg: "bg-teal-50" },
  { name: "Seamless Integrations", description: "Connect your forms to hundreds of third-party tools (CRM, analytics, marketing) with ease.", icon: AdjustmentsHorizontalIcon, color: "text-indigo-500", bg: "bg-indigo-50" },
  { name: "Global Accessibility", description: "Our forms are designed to be accessible (WCAG compliant) and perform optimally worldwide.", icon: GlobeAltIcon, color: "text-orange-500", bg: "bg-orange-50" },
];

// Re-map values for the new design
const coreValues = [
    { icon: FingerPrintIcon, title: "Simplicity", description: "Creating tools that are powerful yet intuitive, ensuring anyone can build a professional form in minutes." },
    { icon: CheckCircleIcon, title: "Integrity", description: "Protecting user data with rigorous security standards and maintaining transparency in all our operations." },
    { icon: RocketLaunchIcon, title: "Performance", description: "Ensuring our forms load instantly and our platform scales effortlessly to meet any demand." },
];


export default function About() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize dark mode from localStorage or default to false
    const savedMode = localStorage.getItem('theme');
    return savedMode === 'dark';
  });

  // Apply or remove 'dark' class to the document body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="space-y-16 pb-24 transition-colors duration-500 bg-gray-50 dark:bg-gray-900 min-h-screen">
      
      {/* 1. Hero / Mission Section with Gradient Header */}
      <section className="relative pt-16 pb-24 bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
        {/* Background Accent - Subtle pattern or shape */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
            <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#4f46e5" fillOpacity="0.1" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,138.7C960,171,1056,213,1152,208C1248,203,1344,155,1392,130.7L1440,107L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
            </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-start justify-between">
                <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-800 dark:text-indigo-400 leading-tight">
                    <span className='block'>InsightForm:</span> The Future of Data Collection
                </h1>
                {/* <button
                    onClick={toggleDarkMode}
                    className="p-3 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-lg"
                    aria-label="Toggle Dark Mode"
                >
                    {isDarkMode ? (
                        <SunIcon className="w-6 h-6 text-yellow-400" />
                    ) : (
                        <MoonIcon className="w-6 h-6 text-gray-700" />
                    )}
                </button> */}
            </div>
            
            <p className="mt-8 max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-300">
                InsightForm is dedicated to transforming data collection from a tedious task into a seamless, intelligent process. We believe that better forms lead to better decisions, and our goal is to empower users to gather insights, not just data points.
            </p>
        </div>
      </section>

      {/* 2. Values Section (3D Card Effect) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <h2 className="sr-only">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreValues.map((item, index) => (
            <div 
              key={index} 
              className="p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-700 ring-4 ring-indigo-300 dark:ring-indigo-600/50 
                         transform hover:scale-[1.02] transition duration-500 ease-in-out cursor-default"
              style={{boxShadow: isDarkMode ? '0 15px 30px -5px rgba(0,0,0,0.5), 0 4px 6px -2px rgba(0,0,0,0.2)' : '0 15px 30px -5px rgba(67, 56, 202, 0.2), 0 4px 6px -2px rgba(67, 56, 202, 0.1)'}}
            >
              <item.icon className="w-12 h-12 text-indigo-600 dark:text-indigo-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{item.title}</h3>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Core Capabilities Section (Replaced Content) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-10 text-center">
            Our <span className='text-indigo-600 dark:text-indigo-400'>Core Capabilities</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreCapabilities.map((capability, index) => (
            <div
              key={capability.name}
              className={`p-6 rounded-xl shadow-lg ring-1 dark:ring-gray-700 transition duration-500 
                          transform hover:translate-y-[-4px] hover:shadow-2xl cursor-pointer 
                          bg-white dark:bg-gray-800 
                          ${index % 2 === 0 ? 'lg:translate-y-0' : 'lg:translate-y-8'}` // Staggered effect kept
                         } 
              style={{
                borderLeft: `4px solid ${capability.color.replace('text-', '#').replace('-500', '500').replace('-400', '400')}`
              }}
            >
              <div className={`p-3 rounded-full w-fit ${capability.bg}`}>
                <capability.icon className={`w-6 h-6 ${capability.color}`} />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-50">{capability.name}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{capability.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Developer Team Section (Professional Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-10 text-center">
            Meet Our <span className='text-indigo-600 dark:text-indigo-400'>Core Team</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {developers.map((dev) => (
            <div 
              key={dev.name} 
              className="group p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 
                         ring-1 ring-gray-200 dark:ring-gray-700 transition duration-300 
                         transform hover:shadow-indigo-500/30 hover:ring-indigo-500/50 text-center"
            >
              {/* Photo/Initials Placeholder */}
              <div className="mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden 
                              ring-2 ring-indigo-500/50 dark:ring-indigo-400/50 mb-4 
                              transition duration-300 group-hover:ring-4 group-hover:ring-indigo-500 dark:group-hover:ring-indigo-400">
                {dev.photoUrl ? (
                  <img
                    src={dev.photoUrl}
                    alt={dev.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails
                      e.target.style.display = 'none';
                      e.target.closest('div').innerHTML = `<div class="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700">${dev.initials}</div>`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700">
                    {dev.initials}
                  </div>
                )}
              </div>

              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-50">{dev.name}</h4>
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">{dev.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}