import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Droplets,
  Hospital,
  CalendarDays,
  Bell,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  HeartHandshake,
  Building2,
  Calendar
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "./context/AdminAuthContext";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import RequestManagement from "./components/RequestManagement";
import UserManagement from "./components/UserManagement";
import HospitalManagement from "./components/HospitalManagement";
import CampManagement from "./components/CampManagement";
import NotificationBroadcast from "./components/NotificationBroadcast";
import AdminSettings from "./components/AdminSettings";

export default function AdminDashboard() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Blood Request Dataset with mock live states
  const [requests, setRequests] = useState([
    {
      id: "BC-101",
      patient: "Aarav Sharma",
      contact: "+91 98101 23456",
      group: "O+",
      units: 2,
      hospital: "City Care Super Specialty Hospital",
      city: "Delhi",
      urgency: "Emergency",
      status: "Pending",
      date: "Today, 09:40 AM",
    },
    {
      id: "BC-102",
      patient: "Pooja Verma",
      contact: "+91 98202 34567",
      group: "B+",
      units: 1,
      hospital: "Apollo Metro Medical Center",
      city: "Gurugram",
      urgency: "Urgent",
      status: "Approved",
      date: "Today, 08:15 AM",
    },
    {
      id: "BC-103",
      patient: "Gurpreet Singh",
      contact: "+91 98303 45678",
      group: "A-",
      units: 3,
      hospital: "LifeLine Multi-Care Hospital",
      city: "Noida",
      urgency: "Emergency",
      status: "Pending",
      date: "Today, 07:50 AM",
    },
    {
      id: "BC-104",
      patient: "Ananya Iyer",
      contact: "+91 98404 56789",
      group: "AB+",
      units: 2,
      hospital: "General Civil Hospital",
      city: "Panipat",
      urgency: "Normal",
      status: "Completed",
      date: "Yesterday, 04:30 PM",
    },
    {
      id: "BC-105",
      patient: "Mohammed Rizwan",
      contact: "+91 98505 67890",
      group: "O-",
      units: 2,
      hospital: "City Care Super Specialty Hospital",
      city: "Delhi",
      urgency: "Emergency",
      status: "Approved",
      date: "Yesterday, 02:15 PM",
    },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Blood Requests", icon: Droplets, badgeKey: "pendingRequests" },
    { name: "Donors & Users", icon: Users },
    { name: "Hospitals", icon: Hospital },
    { name: "Blood Camps", icon: CalendarDays },
    { name: "Alerts & SMS", icon: Bell },
    { name: "Settings", icon: Settings },
  ];

  const pendingRequestsCount = requests.filter((r) => r.status === "Pending").length;
  const approvedRequestsCount = requests.filter((r) => r.status === "Approved").length;

  const stats = [
    {
      title: "Pending Requests",
      value: pendingRequestsCount,
      subtext: "Needs immediate triage",
      icon: AlertTriangle,
      color: "red",
      trend: "+2 this hour",
    },
    {
      title: "Active Donors",
      value: "1,248",
      subtext: "Verified voluntary donors",
      icon: Users,
      color: "blue",
      trend: "+18 today",
    },
    {
      title: "Partner Hospitals",
      value: "42",
      subtext: "Empanelled blood banks",
      icon: Building2,
      color: "purple",
      trend: "4 verified",
    },
    {
      title: "Units Dispatched",
      value: "3,890",
      subtext: "Lifesaving units supplied",
      icon: HeartHandshake,
      color: "emerald",
      trend: "+42 this week",
    },
  ];

  const bloodGroupInventory = [
    { group: "A+", units: 142, status: "Normal", percentage: 70 },
    { group: "A-", units: 28, status: "Low", percentage: 25 },
    { group: "B+", units: 198, status: "Good", percentage: 85 },
    { group: "B-", units: 19, status: "Critical", percentage: 18 },
    { group: "O+", units: 230, status: "Good", percentage: 92 },
    { group: "O-", units: 14, status: "Emergency", percentage: 12 },
    { group: "AB+", units: 84, status: "Normal", percentage: 55 },
    { group: "AB-", units: 9, status: "Critical", percentage: 9 },
  ];

  return (
    <div className="admin-modern-layout">
      {/* Sidebar navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        menuItems={menuItems}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
        pendingCount={pendingRequestsCount}
      />

      {/* Main Workspace Area */}
      <div className="admin-modern-body">
        {/* Top Header bar */}
        <AdminHeader
          activeTab={activeTab}
          onOpenSidebar={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          unreadCount={pendingRequestsCount}
          onRefresh={() => alert("Refreshed live data streams.")}
        />

        {/* Content Views */}
        <main className="admin-main-view">
          {activeTab === "Overview" && (
            <div className="admin-overview-view">
              {/* Welcome banner */}
              <div className="admin-hero-banner">
                <div className="admin-hero-content">
                  <div className="admin-kicker-badge">
                    <ShieldCheck size={14} /> LIVE COMMAND CENTER
                  </div>
                  <h1>Welcome Back, {admin?.name || "Administrator"}</h1>
                  <p>
                    You have <strong>{pendingRequestsCount} pending blood requests</strong> requiring doctor review and urgent donor allocation.
                  </p>
                  <div className="admin-hero-actions">
                    <button
                      className="admin-btn-light"
                      onClick={() => setActiveTab("Blood Requests")}
                    >
                      Review Pending Requests ({pendingRequestsCount}) →
                    </button>
                    <button
                      className="admin-btn-transparent"
                      onClick={() => setActiveTab("Alerts & SMS")}
                    >
                      Broadcast SOS Alert
                    </button>
                  </div>
                </div>
                <div className="admin-hero-graphic">
                  <div className="admin-pulse-circle">
                    <Droplets size={44} />
                  </div>
                </div>
              </div>

              {/* Stat Cards Grid */}
              <div className="admin-metrics-grid">
                {stats.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.title} className={`admin-metric-card color-${s.color}`}>
                      <div className="admin-metric-card-top">
                        <div className={`admin-metric-icon ${s.color}`}>
                          <Icon size={22} />
                        </div>
                        <span className="admin-metric-trend">{s.trend}</span>
                      </div>
                      <div className="admin-metric-content">
                        <h3>{s.value}</h3>
                        <p className="admin-metric-name">{s.title}</p>
                        <small className="admin-metric-note">{s.subtext}</small>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Two Column Grid: Live Blood Bank Stock & Quick Action Recent Requests */}
              <div className="admin-dashboard-two-col">
                {/* Column 1: Live Blood Group Reserve Index */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <h3>National Blood Reserve Index</h3>
                      <p className="admin-subtext">Estimated aggregate units across empanelled hospitals</p>
                    </div>
                    <span className="admin-live-tag">
                      <span className="live-ping" /> Real-time
                    </span>
                  </div>

                  <div className="admin-blood-grid">
                    {bloodGroupInventory.map((item) => (
                      <div key={item.group} className="admin-blood-item">
                        <div className="admin-blood-item-top">
                          <span className="admin-blood-group-tag">{item.group}</span>
                          <span className={`admin-reserve-pill ${item.status.toLowerCase()}`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="admin-blood-count-row">
                          <strong>{item.units}</strong>
                          <span>units</span>
                        </div>
                        <div className="admin-blood-meter">
                          <div
                            className={`admin-meter-fill ${item.status.toLowerCase()}`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="admin-card-footer">
                    <div className="admin-alert-strip">
                      <AlertTriangle size={15} />
                      <span>Critical shortage alert in <strong>O-</strong> and <strong>B-</strong> blood groups in North Zone.</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Recent Requests Quick Review */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <h3>Urgent Blood Requests</h3>
                      <p className="admin-subtext">Requires fast-track confirmation</p>
                    </div>
                    <button
                      className="admin-link-btn"
                      onClick={() => setActiveTab("Blood Requests")}
                    >
                      View All ({requests.length}) →
                    </button>
                  </div>

                  <div className="admin-quick-requests-list">
                    {requests.slice(0, 4).map((req) => (
                      <div key={req.id} className="admin-quick-req-card">
                        <div className="admin-req-icon-col">
                          <span className="admin-blood-bubble">{req.group}</span>
                        </div>

                        <div className="admin-req-details-col">
                          <div className="admin-req-head">
                            <strong>{req.patient}</strong>
                            <span className={`admin-urgency-pill ${req.urgency.toLowerCase()}`}>
                              {req.urgency}
                            </span>
                          </div>
                          <div className="admin-req-meta">
                            <span>{req.hospital} • {req.city}</span>
                          </div>
                          <div className="admin-req-date">
                            <Clock size={12} /> {req.date}
                          </div>
                        </div>

                        <div className="admin-req-action-col">
                          {req.status === "Pending" ? (
                            <button
                              className="admin-quick-approve-btn"
                              onClick={() => handleStatusChange(req.id, "Approved")}
                            >
                              Approve
                            </button>
                          ) : (
                            <span className={`admin-status-pill ${req.status.toLowerCase()}`}>
                              {req.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="admin-card-footer">
                    <div className="admin-flex-between">
                      <span className="admin-subtext">Auto-refresh active (30s)</span>
                      <button
                        className="admin-btn-secondary admin-btn-sm"
                        onClick={() => setActiveTab("Blood Requests")}
                      >
                        Open Full Request Table
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Blood Requests" && (
            <RequestManagement
              requests={requests}
              onRequestStatusChange={handleStatusChange}
            />
          )}

          {activeTab === "Donors & Users" && <UserManagement />}

          {activeTab === "Hospitals" && <HospitalManagement />}

          {activeTab === "Blood Camps" && <CampManagement />}

          {activeTab === "Alerts & SMS" && <NotificationBroadcast />}

          {activeTab === "Settings" && <AdminSettings />}
        </main>
      </div>
    </div>
  );
}
