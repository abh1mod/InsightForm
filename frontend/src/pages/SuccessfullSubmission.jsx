import React from 'react';

// This is a default export of a functional component.
// It's a common pattern in modern React applications.
export default function SuccessfullSubmission() {
  return (
    <>
      {/* It's helpful to have a style tag for custom animations 
        not available in standard Tailwind CSS. This keyframe
        animation creates a subtle fade-in and move-up effect.
      */}
      <style>
        {`
          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
          }
        `}
      </style>
      
      {/* Main container that centers the content vertically and horizontally.
        It has a light gray background to make the card stand out.
      */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 font-sans p-4">
        {/* The main card component. It features a prominent shadow,
          rounded corners, and the entrance animation defined above.
        */}
        <div className="relative w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl overflow-hidden animate-fade-in-up">
          {/* Decorative gradient bar at the top, using green and teal to signify success. */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-teal-500"></div>
          
          <div className="flex flex-col items-center">
            {/* Circular container for the icon, with a light green background to match the theme. */}
            <div className="flex items-center justify-center w-20 h-20 mb-6 bg-green-100 rounded-full">
              {/* SVG Icon: A checkmark to visually represent success.
                aria-hidden="true" is used as the icon is decorative.
              */}
              <svg 
                className="w-10 h-10 text-green-500" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>

            {/* Main title of the page. */}
            <h1 className="text-3xl font-bold text-gray-800 mb-3 text-center">
              Thank You!
            </h1>
            
            {/* A descriptive paragraph confirming the submission. */}
            <p className="text-gray-600 text-center leading-relaxed">
              Your response has been successfully submitted. We appreciate your input.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
