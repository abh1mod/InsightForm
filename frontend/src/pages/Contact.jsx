import React, { useState, useEffect } from 'react';
import { 
  EnvelopeIcon, PhoneIcon, MapPinIcon, SunIcon, MoonIcon, 
  ChatBubbleBottomCenterTextIcon, CheckCircleIcon, XCircleIcon 
} from '@heroicons/react/24/outline';

const FORMSPREE_URL = "https://formspree.io/f/mwpbyenv";

// Data for the static contact details
const contactDetails = [
  { 
    name: 'Email Support', 
    value: 'test.app.services.26@gmail.com', 
    icon: EnvelopeIcon, 
    link: 'mailto:test.app.services.26@gmail.com' 
  },
  { 
    name: 'Sales Hotline', 
    value: '+91 1234567890', 
    icon: PhoneIcon, 
    link: 'tel:+123455689434' 
  },
  { 
    name: 'Headquarters', 
    value: 'Brahmagiri Hostel, Mangalore, NIT-K', 
    icon: MapPinIcon, 
    link: 'https://maps.app.goo.gl/zYYQaX4nVH9bx5679' 
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Status: 'idle', 'success', 'error'
  const [submissionStatus, setSubmissionStatus] = useState('idle');

  // --- Dark Mode Logic (Copied from About.jsx for Consistency) ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode === 'dark';
  });

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
  // --- End Dark Mode Logic ---

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus('idle');

    // Create FormData object from the form state
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('message', formData.message);
    
    // Formspree requires a POST request with FormData
    try {
        const response = await fetch(FORMSPREE_URL, {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            setSubmissionStatus('success');
            setFormData({ name: '', email: '', message: '' }); // Clear form
        } else {
            // Handle errors reported by Formspree
            setSubmissionStatus('error');
        }
    } catch (error) {
        // Handle network errors
        setSubmissionStatus('error');
    } finally {
        setIsSubmitting(false);
        // Clear status after a few seconds
        setTimeout(() => setSubmissionStatus('idle'), 5000);
    }
  };

  const getStatusMessage = () => {
    if (submissionStatus === 'success') {
      return (
        <div className="flex items-center p-3 text-sm font-medium text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-300 transition-opacity">
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          <p>Message sent successfully! We'll be in touch soon.</p>
        </div>
      );
    }
    if (submissionStatus === 'error') {
      return (
        <div className="flex items-center p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300 transition-opacity">
          <XCircleIcon className="w-5 h-5 mr-2" />
          <p>Error sending message. Please try again or use the email link.</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-16 pb-24 transition-colors duration-500 bg-gray-50 dark:bg-gray-900 min-h-screen">
      
      {/* 1. Hero / Header Section */}
      <section className="relative pt-16 pb-20 bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-start justify-between">
                <h1 className="text-5xl sm:text-6xl font-extrabold text-indigo-700 dark:text-indigo-400 leading-tight">
                    <span className='block'>Get In Touch</span>
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
            
            <p className="mt-4 max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-300">
                Have questions, feature requests, or just want to say hello? We'd love to hear from you.
            </p>
        </div>
      </section>

      {/* 2. Contact Form & Info Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700">
          
          {/* Contact Form (2/3 width on large screens) */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6 flex items-center">
              <ChatBubbleBottomCenterTextIcon className="w-8 h-8 mr-3 text-indigo-600 dark:text-indigo-400" />
              Send Us a Message
            </h2>
            
            {/* Submission Status Message */}
            {getStatusMessage()}

            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name" // Formspree uses this name attribute
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email" // Formspree uses this name attribute
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message" // Formspree uses this name attribute
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent 
                             text-base font-medium rounded-lg shadow-md text-white 
                             bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                             transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : 'Send Message'}
                </button>
              </div>
            </form>
          </div>

          {/* Informational Sidebar (1/3 width on large screens) */}
          <div className="lg:col-span-1 p-6 rounded-xl 
                          bg-indigo-50 dark:bg-indigo-900/50 
                          ring-2 ring-indigo-100 dark:ring-indigo-800 self-stretch">
            <h3 className="text-xl font-semibold mb-6 
                           text-indigo-800 dark:text-indigo-200">
              Other Ways to Connect
            </h3>
            <div className="space-y-6">
              {contactDetails.map((item) => (
                <div key={item.name} className="flex items-start">
                  <item.icon className="h-6 w-6 flex-shrink-0 mt-0.5 
                                         text-indigo-600 dark:text-indigo-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium 
                                   text-gray-700 dark:text-gray-300">{item.name}</p>
                    <a href={item.link} className="text-base font-semibold hover:underline 
                                                  text-indigo-700 dark:text-indigo-300">
                      {item.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="mt-8 text-sm italic 
                          text-gray-600 dark:text-gray-400">
              Our team typically responds to inquiries within 24 business hours. For urgent matters, please use the Sales Hotline.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
