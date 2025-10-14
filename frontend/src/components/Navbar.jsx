import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAppContext } from "../context/ContextAPI";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const {isLoggedIn, logout} = useAppContext();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkBase = "block px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const makeLinkClass = ({ isActive }) =>
    [
      linkBase,
      isActive 
        ? "text-blue-600 bg-blue-50" 
        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
    ].join(" ");

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg' 
        : 'bg-white/80 backdrop-blur border-b border-gray-200'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded bg-blue-600 text-white grid place-items-center font-bold transition-all duration-300 ${
                isScrolled ? 'scale-110' : 'scale-100'
              }`}>IF</div>
              <span className={`text-lg font-semibold text-gray-900 transition-all duration-300 ${
                isScrolled ? 'opacity-100' : 'opacity-100'
              }`}>InsightForm</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/" end className={makeLinkClass}>Home</NavLink>
            <NavLink to="/about" className={makeLinkClass}>About</NavLink>
            {isLoggedIn && <NavLink to="/dashboard" className={makeLinkClass}>Dashboard</NavLink>}
            <NavLink to="/contact" className={makeLinkClass}>Contact</NavLink>
            {!isLoggedIn && <NavLink to="/login" className={makeLinkClass}>Login</NavLink>}
            
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-gray-200">
          <div className="space-y-1 px-4 py-3">
            <NavLink to="/" end className={makeLinkClass} onClick={() => setIsOpen(false)}>Home</NavLink>
            <NavLink to="/about" className={makeLinkClass} onClick={() => setIsOpen(false)}>About</NavLink>
            {isLoggedIn && <NavLink to="/dashboard" className={makeLinkClass} onClick={() => setIsOpen(false)}>Dashboard</NavLink>}
            <NavLink to="/contact" className={makeLinkClass} onClick={() => setIsOpen(false)}>Contact</NavLink>
            {!isLoggedIn && <NavLink to="/login" className={makeLinkClass} onClick={() => setIsOpen(false)}>Login</NavLink>}
          </div>
        </div>
      )}
    </nav>
  );
}
