import AdminDashboard from "./pages/AdminDashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Hospitals from "./pages/Hospitals";
import Donation from "./pages/Donation";
import CreateRequest from "./pages/CreateRequest";
import BloodCamps from "./pages/BloodCamps";
import Notifications from "./pages/Notifications";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/donation" element={<Donation />} />
            <Route path="/create-request" element={<CreateRequest />} />
            <Route path="/blood-camps" element={<BloodCamps />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={
              <section className="empty-state">
                <h1>404 — Page Not Found</h1>
                <a href="/" className="btn btn-primary">Back to Home</a>
              </section>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
