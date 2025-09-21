
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <section className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
            <div className="max-w-2xl">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Welcome to InsightForm</h1>
                <p className="mt-4 text-gray-600">
                    Build forms faster with a clean, minimal, and responsive UI. Explore the app to see how the layout and navigation work together.
                </p>
                <div className="mt-6">
                    <Link to="/about" className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Get Started
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
export default Home;