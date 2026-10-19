import { Droplets, X, ChevronRight, LogOut, CheckCircle, Shield, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  menuItems,
  isOpen,
  setIsOpen,
  onLogout,
  pendingCount = 0,
}) {
  const { admin } = useAdminAuth();

  return (
    <>
      {isOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`admin-modern-sidebar ${isOpen ? "open" : ""}`}>
        {/* Brand logo header */}
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-sidebar-brand" onClick={() => setIsOpen(false)}>
            <div className="admin-sidebar-brand-icon">
              <Droplets size={22} />
            </div>
            <div className="admin-sidebar-brand-text">
              <h3>Blood<span>Connect</span></h3>
              <span className="admin-brand-tag">PORTAL CONTROL</span>
            </div>
          </Link>
          <button
            className="admin-sidebar-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* System Health / Status Widget */}
        <div className="admin-status-pill-banner">
          <div className="admin-pulse-dot" />
          <div className="admin-pill-text">
            <span>Core Network</span>
            <strong>99.98% Operational</strong>
          </div>
        </div>

        {/* Navigation list */}
        <div className="admin-nav-section-title">MANAGEMENT CONSOLE</div>
        <nav className="admin-nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.name;
            const hasBadge = item.badgeKey === "pendingRequests" && pendingCount > 0;

            return (
              <button
                key={item.name}
                type="button"
                className={`admin-nav-item ${isSelected ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(item.name);
                  setIsOpen(false);
                }}
              >
                <div className="admin-nav-item-icon">
                  <Icon size={19} />
                </div>
                <span className="admin-nav-item-label">{item.name}</span>
                {hasBadge && (
                  <span className="admin-nav-badge pulse">{pendingCount}</span>
                )}
                {isSelected && (
                  <ChevronRight size={16} className="admin-nav-arrow" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick System Stats in Sidebar */}
        <div className="admin-sidebar-info-card">
          <div className="admin-info-card-header">
            <Shield size={16} className="admin-info-card-icon" />
            <span>Audit & Security</span>
          </div>
          <p>Role-based access enforced. All actions logged in DB audit stream.</p>
        </div>

        {/* Footer: User profile & Logout */}
        <div className="admin-sidebar-footer">
          <div className="admin-profile-pill">
            <div className="admin-profile-avatar">
              {admin?.avatar || (admin?.name ? admin.name[0] : "A")}
            </div>
            <div className="admin-profile-details">
              <strong>{admin?.name || "Administrator"}</strong>
              <small>{admin?.email || "admin@bloodconnect.com"}</small>
            </div>
          </div>

          <div className="admin-sidebar-actions">
            <button
              onClick={onLogout}
              className="admin-logout-btn"
              title="Sign out from Admin"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
            <Link to="/" className="admin-public-link" title="Visit public site">
              Public Site →
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
