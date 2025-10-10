import React, { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify'; // Assuming toast is available for notifications

// Data for the static contact details
const contactDetails = [
  { 
    name: 'Email Support', 
    value: 'support@insightform.com', 
    icon: EnvelopeIcon, 
    link: 'mailto:support@insightform.com' 
  },
  { 
    name: 'Sales Hotline', 
    value: '+1 (555) 123-4567', 
    icon: PhoneIcon, 
    link: 'tel:+15551234567' 
  },
  { 
    name: 'Headquarters', 
    value: 'Brahmagiri Hostel, Mangalore, NIT-K', 
    icon: MapPinIcon, 
    link: 'https://maps.app.goo.gl/YourMapLink' 
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // NOTE: In a real application, you would send this data to an API endpoint here.
    
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Use toast for notification instead of alert()
      // The toast library must be globally available or imported in your root component.
      if (typeof toast !== 'undefined') {
        toast.success("Thank you for your message! We will be in touch shortly.", {
          position: "bottom-center",
          autoClose: 3000,
        });
      } else {
        // Fallback for demonstration if toast isn't set up
        console.log('Form Submitted:', formData);
        alert("Form submitted! Check console for data.");
      }
      
      setFormData({ name: '', email: '', message: '' }); // Clear form
    }, 1500); 
  };

  return (
    <div className="min-h-fit-content pb-8 px-4 rounded-lg
                    bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="mx-auto max-w-5xl">
        
        {/* Header Section */}
        <header className="text-center py-12">
          <h1 className="text-4xl font-extrabold tracking-tight 
                         text-gray-900 dark:text-white">
            Get In Touch
          </h1>
          <p className="mt-4 text-xl 
                        text-gray-600 dark:text-gray-300">
            We're here to help you build smarter forms and gather deeper insights.
          </p>
        </header>

        {/* Main Content Grid: Form (Left) & Info (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 sm:p-10 rounded-2xl shadow-2xl ring-1 
                        bg-white ring-gray-100 
                        dark:bg-gray-800 dark:ring-gray-700">
          
          {/* Contact Form (2/3 width on large screens) */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6 
                           text-gray-900 dark:text-white">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1.5 
                                                text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 border rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500
                             border-gray-300 bg-white 
                             dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5 
                                                text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500
                             border-gray-300 bg-white 
                             dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  required
                />
              </div>

              {/* Message Textarea */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1.5 
                                                text-gray-700 dark:text-gray-300">
                  How can we help?
                </label>
                <textarea
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project or question..."
                  className="w-full px-4 py-2.5 border rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500
                             border-gray-300 bg-white 
                             dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 mt-2 text-white font-bold rounded-xl shadow-md transition-all duration-300 transform 
                           ${isSubmitting 
                              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                              : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-800'}`
                           }
              >
                {isSubmitting ? 'Sending...' : 'Submit Message'}
              </button>
            </form>
          </div>
          
          {/* Informational Sidebar (1/3 width on large screens) */}
          <div className="lg:col-span-1 p-6 rounded-xl 
                          bg-indigo-50 dark:bg-indigo-900/50">
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
      </div>
    </div>
  );
}
