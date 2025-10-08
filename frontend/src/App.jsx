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
import ResetPassword from "./pages/ResetPassword";
import FormCreate from "./pages/FormCreate";
import FormBuilder from "./pages/FormBuilder";
import FormSubmit from "./pages/FormSubmit";

import Report from "./pages/Report";

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
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/formcreate" element={<PrivateRoute><FormCreate /></PrivateRoute>} />
          <Route path="/formbuilder/:formID" element={<PrivateRoute><FormBuilder /></PrivateRoute>} />
          <Route path="/formsubmit/:formID" element={<FormSubmit />} />
          <Route path "/report/:formID" element={<PrivateRoute><Report /></PrivateRoute>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
