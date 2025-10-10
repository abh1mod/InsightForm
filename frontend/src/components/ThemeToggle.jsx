import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../context/ContextAPI';

function ThemeToggle() {
    const {theme ,toggleTheme} = useAppContext();

 return (      
      <button
        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        onClick={toggleTheme}
        className="fixed bottom-4 left-4 z-50 p-3 rounded-full bg-gray-800 text-white shadow-xl dark:bg-yellow-400 dark:text-gray-900 transition-colors duration-300 hover:scale-105"
        aria-label="Toggle dark mode"
      >
        {theme === 'light' ? (
          <SunIcon className="w-6 h-6" />
        ) : (
          <MoonIcon className="w-6 h-6" />
        )}
      </button>
)
}
export default ThemeToggle;