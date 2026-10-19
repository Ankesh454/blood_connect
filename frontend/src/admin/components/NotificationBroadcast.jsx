import { useState } from "react";
import { Bell, Send, CheckCircle2, AlertTriangle, Info, Sparkles } from "lucide-react";

export default function NotificationBroadcast() {
  const [targetAudience, setTargetAudience] = useState("all");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("Delhi NCR");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("urgent");
  const [history, setHistory] = useState([
    {
      id: "NTF-901",
      title: "Urgent O- Negative Blood Required at City Hospital",
      message: "Emergency patient in ICU requires 3 units of O- blood immediately. Donors nearby please respond.",
      audience: "O- Donors in Delhi",
      sentAt: "Today, 09:30 AM",
      priority: "emergency",
      reach: 245,
    },
    {
      id: "NTF-902",
      title: "Upcoming Blood Donation Camp this Sunday",
      message: "Join us at DLF CyberHub amphitheater from 10am to 5pm. Every unit saves three lives!",
      audience: "All Users in Gurugram",
      sentAt: "Yesterday, 04:15 PM",
      priority: "info",
      reach: 1420,
    },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!title || !message) return;

    const newBroadcast = {
      id: `NTF-${900 + history.length + 1}`,
      title,
      message,
      audience:
        targetAudience === "all"
          ? "All Registered Users"
          : `${bloodGroupFilter} Donors in ${cityFilter}`,
      sentAt: "Just now",
      priority,
      reach: targetAudience === "all" ? 2840 : 185,
    };

    setHistory([newBroadcast, ...history]);
    setTitle("");
    setMessage("");
    alert("Alert broadcasted successfully to all target devices!");
  };

  return (
    <div className="admin-view-container">
      <div className="admin-view-header">
        <div>
          <h2>Platform Alerts & SMS / Push Broadcasting</h2>
          <p>Send instant SMS and push notifications to matching blood donors in specific geographical radii during emergencies.</p>
        </div>
      </div>

      <div className="admin-broadcast-layout">
        {/* Left: Compose Form */}
        <div className="admin-broadcast-composer">
          <div className="admin-card-header">
            <h3><Send size={17} /> Compose New Broadcast</h3>
            <span className="admin-subtext">Multi-channel: App Push & SMS</span>
          </div>

          <form onSubmit={handleSend} className="admin-broadcast-form">
            <div className="admin-form-group">
              <label>Target Audience Segment</label>
              <div className="admin-radio-row">
                <label className="admin-radio-label">
                  <input
                    type="radio"
                    name="aud"
                    value="all"
                    checked={targetAudience === "all"}
                    onChange={() => setTargetAudience("all")}
                  />
                  <span>All Users</span>
                </label>
                <label className="admin-radio-label">
                  <input
                    type="radio"
                    name="aud"
                    value="donors"
                    checked={targetAudience === "donors"}
                    onChange={() => setTargetAudience("donors")}
                  />
                  <span>Targeted Donors by Blood Group</span>
                </label>
              </div>
            </div>

            {targetAudience === "donors" && (
              <div className="admin-modal-grid">
                <div className="admin-form-group">
                  <label>Blood Group Filter</label>
                  <select
                    value={bloodGroupFilter}
                    onChange={(e) => setBloodGroupFilter(e.target.value)}
                  >
                    <option value="All">All Groups</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Target City / Region</label>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                  >
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Gurugram">Gurugram</option>
                    <option value="Noida">Noida</option>
                    <option value="Faridabad">Faridabad</option>
                    <option value="Panipat">Panipat</option>
                  </select>
                </div>
              </div>
            )}

            <div className="admin-form-group">
              <label>Priority Level</label>
              <div className="admin-priority-selector">
                <button
                  type="button"
                  className={`admin-priority-btn emergency ${priority === "emergency" ? "active" : ""}`}
                  onClick={() => setPriority("emergency")}
                >
                  <AlertTriangle size={14} /> Critical SOS
                </button>
                <button
                  type="button"
                  className={`admin-priority-btn urgent ${priority === "urgent" ? "active" : ""}`}
                  onClick={() => setPriority("urgent")}
                >
                  <Bell size={14} /> Urgent
                </button>
                <button
                  type="button"
                  className={`admin-priority-btn info ${priority === "info" ? "active" : ""}`}
                  onClick={() => setPriority("info")}
                >
                  <Info size={14} /> General / Camp
                </button>
              </div>
            </div>

            <div className="admin-form-group">
              <label>Notification Headline *</label>
              <input
                type="text"
                required
                placeholder="e.g. Critical: Immediate O- Donors Needed in South Delhi"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Notification Body Message *</label>
              <textarea
                rows={4}
                required
                placeholder="Include hospital name, direct contact phone, patient room number and required units..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button type="submit" className="admin-btn-primary admin-btn-full">
              <Send size={16} /> Broadcast Dispatch to Devices
            </button>
          </form>
        </div>

        {/* Right: Broadcast History */}
        <div className="admin-broadcast-history">
          <div className="admin-card-header">
            <h3>Recent Broadcast Logs</h3>
            <span className="admin-subtext">{history.length} dispatched</span>
          </div>

          <div className="admin-history-list">
            {history.map((item) => (
              <div key={item.id} className="admin-history-card">
                <div className="admin-history-card-top">
                  <span className={`admin-urgency-pill ${item.priority}`}>
                    {item.priority}
                  </span>
                  <span className="admin-subtext">{item.sentAt}</span>
                </div>
                <h4>{item.title}</h4>
                <p>{item.message}</p>
                <div className="admin-history-card-footer">
                  <span>Audience: <strong>{item.audience}</strong></span>
                  <span className="admin-reach-badge">
                    <CheckCircle2 size={13} /> {item.reach} Delivered
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
