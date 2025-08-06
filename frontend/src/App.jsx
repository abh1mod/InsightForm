import React, { useState } from "react";
import clsx from "clsx"; // Optional, helps conditionally combine class names

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const bgClass = darkMode ? "bg-[#0F172A]" : "bg-white";
  const textClass = darkMode ? "text-white" : "text-gray-900";
  const cardClass = darkMode ? "bg-[#1E293B]" : "bg-gray-200";
  const borderClass = darkMode ? "border-gray-800" : "border-gray-300";

  return (
    <div className={clsx("min-h-screen font-sans transition-all", bgClass, textClass)}>
      {/* Navbar */}
      <nav className={`flex items-center justify-between px-8 py-4 border-b ${borderClass}`}>
        <h1 className="text-lg font-semibold">Insight Form</h1>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:underline">About Us</a>
          <a href="#" className="hover:underline">Pricing</a>
          <button
            className="px-4 py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm"
          >
            Login
          </button>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-2 px-3 py-1.5 rounded-md border text-sm transition"
          >
            {darkMode ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* <img
            src=""
            alt="Hero"
            className="rounded-lg mx-auto mb-8 max-h-60"
          /> */}
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
            Craft forms effortlessly with our prompts.
          </h2>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white">
              Start Now
            </button>
            <button className={`px-6 py-2 rounded-md ${cardClass} hover:opacity-90`}>
              Try Free Demo
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="px-6 mb-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            ["10K+", "Active Users"],
            ["150K+", "Forms Generated"],
            ["500K+", "Responses Collected"],
          ].map(([stat, label]) => (
            <div key={label} className={`rounded-lg py-6 ${cardClass}`}>
              <p className="text-2xl font-semibold">{stat}</p>
              <p className="text-sm text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold mb-6">What Our Users Say</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                logo: "/logo-tech.svg",
                quote:
                  "The AI-driven insights from Insight Form have revolutionized our data analysis, providing actionable strategies we never anticipated.",
                author: "Sarah Chen, Tech Innovators Inc.",
              },
              {
                logo: "/logo-consulting.svg",
                quote:
                  "Insight Form's intuitive interface and powerful analytics have significantly improved our client engagement and data-driven decision-making.",
                author: "David Lee, Global Consulting Group",
              },
              {
                logo: "/logo-ecom.svg",
                quote:
                  "Thanks to Insight Form, we now understand our customers better than ever, leading to more effective marketing and increased sales.",
                author: "Emily Wong, Online Retail Emporium",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.author}
                className={`rounded-lg p-6 text-sm ${cardClass}`}
              >
                <img src={testimonial.logo} alt="Logo" className="h-12 mb-4" />
                <p className= "mb-4 text-gray-400">{testimonial.quote}</p>
                <p className={clsx(textClass)}>- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;