
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Droplets,
  Hospital,
  CalendarDays,
  Bell,
  Search,
  Menu,
  X,
  Settings,
  LogOut,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Demo data: replace with backend API data later.
  const [requests, setRequests] = useState([
    { id: "BC-101", patient: "Patient A", group: "O+", hospital: "City Hospital", city: "Delhi", urgency: "Emergency", status: "Pending" },
    { id: "BC-102", patient: "Patient B", group: "B+", hospital: "Care Hospital", city: "Gurugram", urgency: "Urgent", status: "Approved" },
    { id: "BC-103", patient: "Patient C", group: "A-", hospital: "General Hospital", city: "Panipat", urgency: "Normal", status: "Pending" },
    { id: "BC-104", patient: "Patient D", group: "AB+", hospital: "City Hospital", city: "Delhi", urgency: "Urgent", status: "Completed" },
  ]);

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Users", icon: Users },
    { name: "Blood Requests", icon: Droplets },
    { name: "Hospitals", icon: Hospital },
    { name: "Blood Camps", icon: CalendarDays },
    { name: "Notifications", icon: Bell },
    { name: "Settings", icon: Settings },
  ];

  const stats = [
    { title: "Total Users", value: "—", note: "Connect backend to load", icon: Users, color: "blue" },
    { title: "Blood Requests", value: requests.length, note: "Demo records", icon: Droplets, color: "red" },
    { title: "Hospitals", value: "—", note: "Connect backend to load", icon: Hospital, color: "purple" },
    { title: "Donation Camps", value: "—", note: "Connect backend to load", icon: CalendarDays, color: "orange" },
  ];

  function updateRequest(id, status) {
    setRequests(current =>
      current.map(request =>
        request.id === id ? { ...request, status } : request
      )
    );
  }

  const filteredRequests = requests.filter(request =>
    `${request.id} ${request.patient} ${request.group} ${request.hospital} ${request.city}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function renderContent() {
    if (activeTab === "Blood Requests" || activeTab === "Overview") {
      return (
        <>
          {activeTab === "Overview" && (
            <>
              <div className="admin-stats">
                {stats.map(stat => {
                  const Icon = stat.icon;
                  return (
                    <div className="admin-stat" key={stat.title}>
                      <div className={`admin-stat-icon ${stat.color}`}>
                        <Icon size={21} />
                      </div>
                      <p>{stat.title}</p>
                      <h2>{stat.value}</h2>
                      <small>{stat.note}</small>
                    </div>
                  );
                })}
              </div>

              <div className="admin-welcome">
                <div>
                  <span className="admin-kicker">PLATFORM MANAGEMENT</span>
                  <h2>Welcome to BloodConnect Admin</h2>
                  <p>Monitor blood requests and manage platform activities.</p>
                </div>
                <ShieldCheck size={44} />
              </div>
            </>
          )}

          <div className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h3>{activeTab === "Overview" ? "Recent Blood Requests" : "Manage Blood Requests"}</h3>
                <p>Review and update request statuses.</p>
              </div>
              <span className="admin-count">{filteredRequests.length} records</span>
            </div>

            <div className="admin-search">
              <Search size={18} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by ID, blood group, hospital..."
              />
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Request</th>
                    <th>Blood Group</th>
                    <th>Hospital / City</th>
                    <th>Urgency</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map(request => (
                    <tr key={request.id}>
                      <td>
                        <strong>{request.id}</strong>
                        <small>{request.patient}</small>
                      </td>
                      <td><span className="admin-blood">{request.group}</span></td>
                      <td>{request.hospital}<small>{request.city}</small></td>
                      <td>
                        <span className={`admin-urgency ${request.urgency.toLowerCase()}`}>
                          {request.urgency}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-status ${request.status.toLowerCase()}`}>
                          {request.status}
                        </span>
                      </td>
                      <td>
                        {request.status === "Pending" ? (
                          <div className="admin-actions">
                            <button
                              className="admin-approve"
                              onClick={() => updateRequest(request.id, "Approved")}
                            >
                              Approve
                            </button>
                            <button
                              className="admin-reject"
                              onClick={() => updateRequest(request.id, "Rejected")}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="admin-muted">Updated</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!filteredRequests.length && (
                    <tr>
                      <td colSpan="6" className="admin-empty">
                        No matching requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="admin-demo-note">
              Demo records only. Changes are currently stored in page state, not in the database.
            </p>
          </div>
        </>
      );
    }

    const sectionInfo = {
      Users: {
        icon: Users,
        title: "User Management",
        text: "View registered users, manage accounts and review user activity.",
      },
      Hospitals: {
        icon: Hospital,
        title: "Hospital Management",
        text: "Manage hospital profiles, addresses and verified contact information.",
      },
      "Blood Camps": {
        icon: CalendarDays,
        title: "Blood Camp Management",
        text: "Create and manage donation camps, schedules and locations.",
      },
      Notifications: {
        icon: Bell,
        title: "Notifications",
        text: "Prepare platform announcements and important user updates.",
      },
      Settings: {
        icon: Settings,
        title: "Admin Settings",
        text: "Configure administrative preferences and account security.",
      },
    };

    const info = sectionInfo[activeTab];
    const Icon = info?.icon || Activity;

    return (
      <div className="admin-panel admin-placeholder">
        <div className="admin-placeholder-icon"><Icon size={30} /></div>
        <h2>{info?.title || activeTab}</h2>
        <p>{info?.text}</p>
        <div className="admin-coming-soon">
          <Clock size={17} />
          Backend integration pending
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {sidebarOpen && (
        <button
          className="admin-mobile-overlay"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <Link to="/" className="admin-brand">
          <span className="admin-brand-icon"><Droplets size={25} /></span>
          <span>Blood<span>Connect</span><small>ADMIN PANEL</small></span>
        </Link>

        <div className="admin-menu-label">WORKSPACE</div>

        <nav className="admin-menu">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                className={`admin-menu-item ${activeTab === item.name ? "selected" : ""}`}
                onClick={() => {
                  setActiveTab(item.name);
                  setSidebarOpen(false);
                  setSearch("");
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>
                {item.name === "Blood Requests" && <ArrowUpRight size={15} className="admin-menu-arrow" />}
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <div><strong>Administrator</strong><small>Admin account</small></div>
          </div>
          <Link to="/" className="admin-logout"><LogOut size={17} /> Back to Website</Link>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button className="admin-mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu />
          </button>
          <div>
            <span className="admin-breadcrumb">BloodConnect /</span>
            <strong>{activeTab}</strong>
          </div>
          <div className="admin-top-right">
            <span className="admin-live"><span /> Demo mode</span>
            <div className="admin-avatar">A</div>
          </div>
        </header>

        <section className="admin-content">
          <div className="admin-page-heading">
            <div>
              <h1>{activeTab}</h1>
              <p>Manage and monitor BloodConnect activities.</p>
            </div>
            {activeTab === "Blood Camps" && (
              <button className="btn btn-primary" onClick={() => alert("Connect the blood camps API to create camps.")}>
                <Plus size={17} /> Add Camp
              </button>
            )}
            {activeTab === "Hospitals" && (
              <button className="btn btn-primary" onClick={() => alert("Connect the hospitals API to add hospitals.")}>
                <Plus size={17} /> Add Hospital
              </button>
            )}
          </div>

          {renderContent()}
        </section>

        <footer className="admin-footer">
          <span>BloodConnect Admin</span>
          <span><CheckCircle size={14} /> Dashboard UI ready</span>
        </footer>
      </main>
    </div>
  );
}
