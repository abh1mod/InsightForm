import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, CodeBracketIcon, BoltIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

// Data for the developer team - ADDED 'photoUrl' field
const developers = [
  // Using Tailwind's ring-indigo-50/50 for a placeholder ring effect
  { name: "Abhishek", role: "Full Stack Developer", initials: "A", photoUrl: "https://placehold.co/128x128/f0f9ff/1e3a8a?text=A" },
  { name: "Anubhav Shrivastava", role: "API Engineer", initials: "AS", photoUrl: "https://placehold.co/128x128/f0f9ff/1e3a8a?text=AS" },
  { name: "Kushagra Singh", role: "Frontend Developer", initials: "KS", photoUrl: "https://placehold.co/128x128/f0f9ff/1e3a8a?text=KS" },
  { name: "Naveen Vashishtha", role: "Full Stack Developer", initials: "NV", photoUrl: "https://placehold.co/128x128/f0f9ff/1e3a8a?text=NV" },
];

export default function About() {
  

  return (
    <div className="space-y-8 pb-20 transition-colors duration-500 bg-gray-50 dark:bg-gray-900 min-h-screen px-4 md:px-8 pt-8 rounded-lg">
      

      {/* 1. Hero Section: The 'Our Story' Equivalent */}
      <section className="text-center rounded-2xl p-10 shadow-lg ring-1 transition-colors duration-500
                          bg-indigo-50 ring-indigo-200 
                          dark:bg-indigo-900/50 dark:ring-indigo-800">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight 
                       text-gray-900 dark:text-gray-50">
          Our Story: The InsightForm Difference
        </h1>
        <p className="mt-4 text-xl max-w-3xl mx-auto 
                      text-gray-700 dark:text-gray-300">
          We believe data collection should be intuitive, fast, and seamlessly integrated. InsightForm was founded on the principle that powerful tools should feel effortless to use.
        </p>
      </section>

      {/* 2. Mission & Vision - Expanded Main Content */}
      <section className="rounded-2xl p-8 shadow-xl ring-1 transition-colors duration-500
                          bg-white ring-gray-100 
                          dark:bg-gray-800 dark:ring-gray-700">
        <h2 className="text-3xl font-bold border-b pb-3 mb-6 
                       text-gray-900 dark:text-gray-50 dark:border-gray-700">
          The Mission: Simplifying Complexity
        </h2>
        <p className="mt-4 text-lg leading-relaxed 
                      text-gray-700 dark:text-gray-300">
          The digital landscape is cluttered with complex, slow form builders. InsightForm was developed to cut through that noise. Our mission is to provide developers, researchers, and teams with a <b>lightning-fast, developer-centric platform</b> for collecting actionable data. We don't just build forms; we build intelligent data pipelines designed for modern applications.
        </p>
        <p className="mt-4 text-lg leading-relaxed 
                      text-gray-700 dark:text-gray-300">
          Our vision extends beyond mere data entry. We aim to integrate advanced functionalities like AI-assisted question generation (as seen in our features) and real-time analytics, making data acquisition not a chore, but a core strategic advantage.
        </p>
      </section>
      
      {/* 3. Core Principles / Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Principle Card 1: Simplicity */}
        <div className="p-6 rounded-2xl shadow-md ring-1 transition duration-300 hover:shadow-lg
                        bg-white ring-gray-100 
                        dark:bg-gray-800 dark:ring-gray-700 dark:hover:shadow-indigo-500/20">
          <CheckCircleIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
          <h3 className="text-xl font-semibold 
                         text-gray-900 dark:text-gray-50">User Simplicity</h3>
          <p className="mt-2 
                        text-gray-600 dark:text-gray-400">
            A minimal, distraction-free UI ensures users can focus entirely on the task: building or filling out the form quickly.
          </p>
        </div>
        
        {/* Principle Card 2: Speed */}
        <div className="p-6 rounded-2xl shadow-md ring-1 transition duration-300 hover:shadow-lg
                        bg-white ring-gray-100 
                        dark:bg-gray-800 dark:ring-gray-700 dark:hover:shadow-indigo-500/20">
          <BoltIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mb-3" />
          <h3 className="text-xl font-semibold 
                         text-gray-900 dark:text-gray-50">Performance First</h3>
          <p className="mt-2 
                        text-gray-600 dark:text-gray-400">
            Built entirely on React and Tailwind CSS, the application is highly optimized, ensuring rapid load times and smooth interactions on all devices.
          </p>
        </div>
        
        {/* Principle Card 3: Stability */}
        <div className="p-6 rounded-2xl shadow-md ring-1 transition duration-300 hover:shadow-lg
                        bg-white ring-gray-100 
                        dark:bg-gray-800 dark:ring-gray-700 dark:hover:shadow-indigo-500/20">
          <CodeBracketIcon className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
          <h3 className="text-xl font-semibold 
                         text-gray-900 dark:text-gray-50">Architectural Integrity</h3>
          <p className="mt-2 
                        text-gray-600 dark:text-gray-400">
            The code base is clean, modular, and scalable, using modern React patterns to ensure long-term stability and easy maintenance.
          </p>
        </div>
      </div>
      
      {/* 4. Meet the Developers Section (New) */}
      <section className="rounded-2xl p-8 shadow-xl ring-1 transition-colors duration-500
                          bg-white ring-gray-100 
                          dark:bg-gray-800 dark:ring-gray-700">
        <h2 className="text-3xl font-bold border-b pb-3 mb-8 
                       text-gray-900 dark:text-gray-50 dark:border-gray-700">
          Meet the Developers
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 justify-items-center">
          {developers.map((dev) => (
            <div key={dev.name} className="text-center">
              {/* Profile Picture (Image or Placeholder) */}
              {dev.photoUrl ? (
                // If photoUrl exists, use an img tag
                <img 
                  src={dev.photoUrl} 
                  alt={`Photo of ${dev.name}`} 
                  className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full object-cover shadow-lg ring-4 ring-indigo-50/50" 
                  // Fallback to initials if image fails to load
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.parentNode.innerHTML = 
                      `<div class="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-500 dark:text-gray-400 shadow-inner ring-4 ring-indigo-50/50">
                        ${dev.initials}
                       </div>`;
                  }}
                />
              ) : (
                // Original Placeholder (if photoUrl is empty)
                <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-500 dark:text-gray-400 shadow-inner ring-4 ring-indigo-50/50">
                  {dev.initials}
                </div>
              )}

              <h4 className="mt-4 text-lg font-semibold 
                             text-gray-900 dark:text-gray-50">{dev.name}</h4>
              <p className="text-sm 
                            text-indigo-600 dark:text-indigo-400">{dev.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Technology Stack Section (Placeholder Preservation) */}
      <section className="rounded-2xl p-8 shadow-sm ring-1 
                          bg-white ring-gray-200
                          dark:bg-gray-800 dark:ring-gray-700">
        <h2 className="text-2xl font-semibold 
                       text-gray-900 dark:text-gray-50">InsightForm's Technology Stack</h2>
        <p className="mt-4 leading-relaxed 
                      text-gray-600 dark:text-gray-300">
          InsightForm is built on a modern stack to deliver performance and developer experience. The frontend leverages **React** with **React Router v6** for efficient navigation and state management. All styling is managed by **Tailwind CSS**, ensuring the UI is consistently clean, minimal, and fully **responsive** across mobile, tablet, and desktop viewports.
        </p>
      </section>
      
    </div>
  );
}

