import { useState } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  FileSpreadsheet,
  Building,
  User,
  Phone,
  Calendar,
  Droplet
} from "lucide-react";

export default function RequestManagement({ requests, onRequestStatusChange }) {
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterUrgency, setFilterUrgency] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const filtered = requests.filter((req) => {
    const matchesStatus = filterStatus === "All" || req.status === filterStatus;
    const matchesUrgency = filterUrgency === "All" || req.urgency === filterUrgency;
    const query = search.toLowerCase();
    const matchesSearch =
      req.id.toLowerCase().includes(query) ||
      req.patient.toLowerCase().includes(query) ||
      req.group.toLowerCase().includes(query) ||
      req.hospital.toLowerCase().includes(query) ||
      req.city.toLowerCase().includes(query);
    return matchesStatus && matchesUrgency && matchesSearch;
  });

  return (
    <div className="admin-view-container">
      {/* View Header with stats */}
      <div className="admin-view-header">
        <div>
          <h2>Blood Emergency & Replenishment Requests</h2>
          <p>Verify clinical legitimacy, authorize hospital requests and direct nearby voluntary donors.</p>
        </div>
        <div className="admin-view-actions">
          <button
            className="admin-btn-secondary"
            onClick={() => alert("Exporting requests report as CSV...")}
          >
            <FileSpreadsheet size={16} /> Export Records
          </button>
        </div>
      </div>

      {/* Control bar: search & filters */}
      <div className="admin-filters-bar">
        <div className="admin-search-input-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by Request ID, patient, hospital, blood group, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-filter-selects">
          <div className="admin-select-wrapper">
            <span className="admin-filter-label">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="admin-select-wrapper">
            <span className="admin-filter-label">Urgency:</span>
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
            >
              <option value="All">All Urgency</option>
              <option value="Emergency">Emergency</option>
              <option value="Urgent">Urgent</option>
              <option value="Normal">Normal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Request Table */}
      <div className="admin-table-container">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Request ID & Date</th>
              <th>Patient / Requester</th>
              <th>Blood Group</th>
              <th>Units</th>
              <th>Hospital & City</th>
              <th>Urgency</th>
              <th>Current Status</th>
              <th>Manage Decisions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((req) => (
              <tr key={req.id}>
                <td>
                  <strong className="admin-table-code">{req.id}</strong>
                  <div className="admin-subtext">{req.date || "Today, 10:15 AM"}</div>
                </td>

                <td>
                  <div className="admin-table-person">
                    <strong>{req.patient}</strong>
                    <div className="admin-subtext">Contact: {req.contact || "+91 98765 43210"}</div>
                  </div>
                </td>

                <td>
                  <span className="admin-blood-badge">
                    <Droplet size={13} fill="currentColor" /> {req.group}
                  </span>
                </td>

                <td>
                  <strong>{req.units || 2}</strong> <span className="admin-subtext">Units</span>
                </td>

                <td>
                  <div className="admin-hospital-cell">
                    <strong>{req.hospital}</strong>
                    <div className="admin-subtext">{req.city}</div>
                  </div>
                </td>

                <td>
                  <span className={`admin-urgency-pill ${req.urgency.toLowerCase()}`}>
                    {req.urgency === "Emergency" && <AlertTriangle size={12} />}
                    {req.urgency}
                  </span>
                </td>

                <td>
                  <span className={`admin-status-pill ${req.status.toLowerCase()}`}>
                    {req.status === "Approved" && <CheckCircle size={12} />}
                    {req.status === "Pending" && <Clock size={12} />}
                    {req.status === "Rejected" && <XCircle size={12} />}
                    {req.status}
                  </span>
                </td>

                <td>
                  <div className="admin-action-btn-row">
                    {req.status === "Pending" ? (
                      <>
                        <button
                          className="admin-table-btn-approve"
                          onClick={() => onRequestStatusChange(req.id, "Approved")}
                          title="Approve blood request"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          className="admin-table-btn-reject"
                          onClick={() => onRequestStatusChange(req.id, "Rejected")}
                          title="Reject request"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </>
                    ) : (
                      <span className="admin-completed-chip">
                        {req.status === "Approved" ? "Authorized" : req.status}
                      </span>
                    )}

                    <button
                      className="admin-table-btn-view"
                      onClick={() => setSelectedRequest(req)}
                      title="Inspect clinical details"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="admin-empty-table-cell">
                  <div className="admin-empty-illustration">
                    <Clock size={36} />
                    <h4>No Matching Requests Found</h4>
                    <p>Try modifying your search keywords or resetting status filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedRequest(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3>Request Dossier — {selectedRequest.id}</h3>
                <span className={`admin-urgency-pill ${selectedRequest.urgency.toLowerCase()}`}>
                  {selectedRequest.urgency} priority
                </span>
              </div>
              <button
                className="admin-modal-close"
                onClick={() => setSelectedRequest(null)}
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-modal-grid">
                <div className="admin-modal-field">
                  <label><User size={14} /> Patient Name</label>
                  <p>{selectedRequest.patient}</p>
                </div>
                <div className="admin-modal-field">
                  <label><Droplet size={14} /> Blood Group Required</label>
                  <p className="admin-blood-highlight">{selectedRequest.group} ({selectedRequest.units || 2} Units)</p>
                </div>
                <div className="admin-modal-field">
                  <label><Building size={14} /> Admitted Hospital</label>
                  <p>{selectedRequest.hospital}, {selectedRequest.city}</p>
                </div>
                <div className="admin-modal-field">
                  <label><Phone size={14} /> Attendant Contact</label>
                  <p>{selectedRequest.contact || "+91 98765 43210"}</p>
                </div>
                <div className="admin-modal-field">
                  <label><Calendar size={14} /> Requirement Date</label>
                  <p>{selectedRequest.date || "Immediate / Within 6 hours"}</p>
                </div>
                <div className="admin-modal-field">
                  <label>Current Disposition</label>
                  <span className={`admin-status-pill ${selectedRequest.status.toLowerCase()}`}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>

              <div className="admin-modal-notes">
                <label>Clinical Notes & Reason:</label>
                <div className="admin-notes-content">
                  Patient scheduled for major surgery with severe hemoglobin deficiency. Cross-matching verified with district central blood bank.
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              {selectedRequest.status === "Pending" && (
                <>
                  <button
                    className="admin-btn-primary"
                    onClick={() => {
                      onRequestStatusChange(selectedRequest.id, "Approved");
                      setSelectedRequest(null);
                    }}
                  >
                    <CheckCircle size={15} /> Confirm Approval
                  </button>
                  <button
                    className="admin-btn-danger"
                    onClick={() => {
                      onRequestStatusChange(selectedRequest.id, "Rejected");
                      setSelectedRequest(null);
                    }}
                  >
                    <XCircle size={15} /> Reject Request
                  </button>
                </>
              )}
              <button
                className="admin-btn-secondary"
                onClick={() => setSelectedRequest(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
