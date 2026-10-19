import { Menu, Search, Bell, Shield, ExternalLink, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminHeader({
  activeTab,
  onOpenSidebar,
  searchQuery,
  setSearchQuery,
  unreadCount = 2,
  onRefresh,
}) {
  const { admin } = useAdminAuth();

  return (
    <header className="admin-header-bar">
      <div className="admin-header-left">
        <button
          className="admin-hamburger-btn"
          onClick={onOpenSidebar}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="admin-breadcrumbs">
          <Link to="/admin" className="admin-crumb-parent">Control Center</Link>
          <span className="admin-crumb-sep">/</span>
          <span className="admin-crumb-current">{activeTab}</span>
        </div>
      </div>

      <div className="admin-header-center">
        <div className="admin-header-search">
          <Search size={16} className="admin-header-search-icon" />
          <input
            type="text"
            placeholder="Search donors, requests, hospital codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-header-right">
        {onRefresh && (
          <button
            className="admin-action-icon-btn"
            title="Refresh current dataset"
            onClick={onRefresh}
          >
            <RefreshCw size={17} />
          </button>
        )}

        <div className="admin-notif-btn-wrap">
          <button className="admin-action-icon-btn" title="View alerts">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="admin-notif-dot">{unreadCount}</span>
            )}
          </button>
        </div>

        <div className="admin-header-divider" />

        <div className="admin-header-user">
          <div className="admin-header-avatar">
            {admin?.avatar || (admin?.name ? admin.name[0] : "A")}
          </div>
          <div className="admin-header-user-meta">
            <span className="admin-header-user-name">{admin?.name || "Administrator"}</span>
            <span className="admin-header-badge">
              <Shield size={10} /> {admin?.role || "Super Admin"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
