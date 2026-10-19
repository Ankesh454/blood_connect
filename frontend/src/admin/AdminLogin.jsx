import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Droplets, Shield, Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAdminAuth } from "./context/AdminAuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@bloodconnect.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      setIsLoading(false);
      if (result.success) {
        navigate("/admin");
      } else {
        setError(result.message || "Failed to authenticate as admin");
      }
    }, 450);
  };

  const fillDemoCreds = () => {
    setEmail("admin@bloodconnect.com");
    setPassword("admin123");
    setError("");
  };

  return (
    <div className="admin-auth-page">
      {/* Decorative ambient gradient spots */}
      <div className="admin-auth-glow-top" />
      <div className="admin-auth-glow-bottom" />

      <div className="admin-auth-container">
        {/* Left Side: Brand Story & Security badge */}
        <div className="admin-auth-banner">
          <div className="admin-banner-brand">
            <div className="admin-banner-logo">
              <Droplets size={26} strokeWidth={2.4} />
            </div>
            <div>
              <h3>Blood<span>Connect</span></h3>
              <p className="admin-banner-badge">SECURE CONTROL PORTAL</p>
            </div>
          </div>

          <div className="admin-banner-content">
            <span className="admin-shield-tag">
              <Shield size={14} /> Encrypted Staff Portal
            </span>
            <h1>Centralized Blood Bank & Donor Operations</h1>
            <p>
              Real-time dispatch, inventory replenishment alerts, verified hospital directory, and emergency camp scheduling dashboard.
            </p>

            <div className="admin-feature-list">
              <div className="admin-feature-pill">
                <CheckCircle2 size={16} /> Instant Emergency Request Approvals
              </div>
              <div className="admin-feature-pill">
                <CheckCircle2 size={16} /> Hospital Inventory Synchronization
              </div>
              <div className="admin-feature-pill">
                <CheckCircle2 size={16} /> Audit Trail & Donor Registry Privacy
              </div>
            </div>
          </div>

          <div className="admin-banner-footer">
            <p>© 2026 BloodConnect Health Network. Restricted Access.</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="admin-auth-card-wrap">
          <div className="admin-auth-card">
            <div className="admin-auth-header">
              <div className="admin-auth-icon-badge">
                <Shield size={24} />
              </div>
              <h2>Administrator Sign In</h2>
              <p>Enter your authorized staff credentials to access the console</p>
            </div>

            {error && (
              <div className="admin-auth-error">
                <AlertCircle size={17} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="admin-auth-form">
              <div className="admin-form-group">
                <label htmlFor="admin-email">Admin Email ID</label>
                <div className="admin-input-wrap">
                  <Mail size={18} className="admin-field-icon" />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@bloodconnect.com"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <div className="admin-label-row">
                  <label htmlFor="admin-pass">Security Key / Password</label>
                  <button
                    type="button"
                    className="admin-hint-link"
                    onClick={fillDemoCreds}
                  >
                    Use Demo Creds
                  </button>
                </div>
                <div className="admin-input-wrap">
                  <Lock size={18} className="admin-field-icon" />
                  <input
                    id="admin-pass"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                  />
                  <button
                    type="button"
                    className="admin-toggle-pwd"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="admin-auth-options">
                <label className="admin-remember-label">
                  <input type="checkbox" defaultChecked />
                  <span>Stay logged in for this workstation</span>
                </label>
              </div>

              <button
                type="submit"
                className="admin-auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Authenticate Console</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            <div className="admin-auth-card-footer">
              <div className="admin-demo-badge">
                <strong>Demo Access:</strong>
                <span>admin@bloodconnect.com / admin123</span>
              </div>
              <Link to="/" className="admin-back-home-link">
                ← Return to Public Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
