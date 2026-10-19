import { useState } from "react";
import { Users, Search, UserCheck, ShieldAlert, Mail, Phone, Calendar, Droplets, Plus, BadgeCheck } from "lucide-react";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [users, setUsers] = useState([
    {
      id: "USR-001",
      name: "Rahul Sharma",
      email: "rahul.s@example.com",
      phone: "+91 98112 34567",
      bloodGroup: "O+",
      role: "donor",
      status: "active",
      donations: 4,
      joined: "12 Jan 2026",
    },
    {
      id: "USR-002",
      name: "Dr. Sunita Kapoor",
      email: "dr.sunita@medicare.org",
      phone: "+91 98223 45678",
      bloodGroup: "A+",
      role: "hospital_admin",
      status: "active",
      donations: 1,
      joined: "04 Feb 2026",
    },
    {
      id: "USR-003",
      name: "Ankit Verma",
      email: "ankit.v@example.com",
      phone: "+91 98334 56789",
      bloodGroup: "B-",
      role: "donor",
      status: "active",
      donations: 2,
      joined: "18 Feb 2026",
    },
    {
      id: "USR-004",
      name: "Meera Nair",
      email: "meera.n@domain.com",
      phone: "+91 98445 67890",
      bloodGroup: "AB+",
      role: "donor",
      status: "blocked",
      donations: 0,
      joined: "22 Feb 2026",
    },
    {
      id: "USR-005",
      name: "Vikram Malhotra",
      email: "v.malhotra@redcross.org",
      phone: "+91 98556 78901",
      bloodGroup: "O-",
      role: "admin",
      status: "active",
      donations: 6,
      joined: "01 Jan 2026",
    },
  ]);

  const toggleStatus = (id) => {
    setUsers((current) =>
      current.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === "active" ? "blocked" : "active";
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    const query = search.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.phone.includes(query) ||
      u.bloodGroup.toLowerCase().includes(query);
    return matchesRole && matchesSearch;
  });

  return (
    <div className="admin-view-container">
      <div className="admin-view-header">
        <div>
          <h2>Registered Users & Donors Database</h2>
          <p>Supervise voluntary donor accounts, hospital coordinators, and verify donor availability.</p>
        </div>
        <div className="admin-view-actions">
          <button
            className="admin-btn-primary"
            onClick={() => alert("Registration modal: Backend integration can add direct staff users.")}
          >
            <Plus size={16} /> Add Verified Donor
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filters-bar">
        <div className="admin-search-input-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by name, email, phone, blood group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-filter-selects">
          <div className="admin-select-wrapper">
            <span className="admin-filter-label">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="donor">Voluntary Donors</option>
              <option value="hospital_admin">Hospital Admin</option>
              <option value="admin">System Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="admin-table-container">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>User ID & Name</th>
              <th>Contact Details</th>
              <th>Blood Group</th>
              <th>Role</th>
              <th>Donation Count</th>
              <th>Account Status</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="admin-user-cell">
                    <div className="admin-user-avatar">
                      {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <strong>{u.name}</strong>
                      <div className="admin-subtext">{u.id}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="admin-subtext-group">
                    <div className="admin-subtext-item">
                      <Mail size={12} /> {u.email}
                    </div>
                    <div className="admin-subtext-item">
                      <Phone size={12} /> {u.phone}
                    </div>
                  </div>
                </td>

                <td>
                  <span className="admin-blood-badge">
                    <Droplets size={13} fill="currentColor" /> {u.bloodGroup}
                  </span>
                </td>

                <td>
                  <span className={`admin-role-badge ${u.role}`}>
                    {u.role === "donor" ? "Donor" : u.role === "hospital_admin" ? "Hospital Staff" : "Admin"}
                  </span>
                </td>

                <td>
                  <strong>{u.donations}</strong> <span className="admin-subtext">times</span>
                </td>

                <td>
                  <span className={`admin-status-pill ${u.status}`}>
                    {u.status === "active" ? (
                      <>
                        <BadgeCheck size={12} /> Active
                      </>
                    ) : (
                      <>
                        <ShieldAlert size={12} /> Blocked
                      </>
                    )}
                  </span>
                </td>

                <td className="admin-subtext">{u.joined}</td>

                <td>
                  <button
                    className={`admin-table-toggle-btn ${u.status === "active" ? "block" : "unblock"}`}
                    onClick={() => toggleStatus(u.id)}
                  >
                    {u.status === "active" ? "Block" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
