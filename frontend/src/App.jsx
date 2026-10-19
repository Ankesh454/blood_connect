import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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

// Admin Module
import { AdminAuthProvider } from "./admin/context/AdminAuthContext";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ProtectedAdminRoute from "./admin/components/ProtectedAdminRoute";
import "./admin/admin.css";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className={isAdminRoute ? "admin-app-root" : "app-shell"}>
      {/* Hide general consumer Navbar and Footer when in the Admin portal */}
      {!isAdminRoute && <Navbar />}
      
      <main className={isAdminRoute ? "admin-root-content" : "main-content"}>
        <Routes>
          {/* Public Patient & Donor Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/create-request" element={<CreateRequest />} />
          <Route path="/blood-camps" element={<BloodCamps />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          {/* Fallback 404 */}
          <Route
            path="*"
            element={
              <section className="empty-state">
                <h1>404 — Page Not Found</h1>
                <a href="/" className="btn btn-primary">
                  Back to Home
                </a>
              </section>
            }
          />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
