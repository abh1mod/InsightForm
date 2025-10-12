function AuthRequired(){
    return <>
      {/* It's helpful to have a style tag for custom animations not available in standard Tailwind */}
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
      
      {/* Main container with a subtle gradient background */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 font-sans p-4">
        {/* The card itself, with enhanced styling and a subtle entrance animation */}
        <div className="relative w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl overflow-hidden animate-fade-in-up">
          {/* Decorative gradient bar at the top */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
          
          <div className="flex flex-col items-center">
            {/* Circular container for the icon */}
            <div className="flex items-center justify-center w-20 h-20 mb-6 bg-indigo-100 rounded-full">
              {/* Lock Icon SVG */}
              <svg 
                className="w-10 h-10 text-indigo-500" 
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-3 text-center">
              Login Required
            </h1>
            
            {/* Description */}
            <p className="text-gray-600 text-center leading-relaxed">
              You must be logged in to view this content. Please sign in to gain access.
            </p>
          </div>
        </div>
      </div>
    </>
}

export default AuthRequired;