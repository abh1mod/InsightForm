import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import AuthSuccess from "./pages/AuthSuccess";
import AuthFailure from "./pages/AuthFailure";
import PrivateRoute from "./components/PrivateRoute";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
   return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>   {/* Wrap with layout */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/auth/failure" element={<AuthFailure />} />

          <Route path="/verify/:token" element={<VerifyEmail/>} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
