
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout(){
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;