import { useState } from "react";
import { CalendarDays, MapPin, Users, Clock, Plus, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

export default function CampManagement() {
  const [showModal, setShowModal] = useState(false);
  const [camps, setCamps] = useState([
    {
      id: "CAMP-101",
      name: "Rotary Youth Mega Blood Donation Drive",
      organizer: "Rotary Club of Delhi Central",
      date: "25 Oct 2026",
      time: "09:00 AM – 04:00 PM",
      location: "Community Center, Sector 15, Rohini, Delhi",
      targetUnits: 150,
      registeredDonors: 112,
      status: "Upcoming",
    },
    {
      id: "CAMP-102",
      name: "CyberHub Corporate LifeSaver Camp",
      organizer: "DLF Foundation & Red Cross",
      date: "28 Oct 2026",
      time: "10:00 AM – 05:00 PM",
      location: "Amphitheater, DLF CyberHub, Gurugram",
      targetUnits: 250,
      registeredDonors: 198,
      status: "Upcoming",
    },
    {
      id: "CAMP-103",
      name: "University Campus Blood Donation Festival",
      organizer: "NSS Unit, Delhi University",
      date: "14 Oct 2026",
      time: "09:30 AM – 03:30 PM",
      location: "North Campus Sports Complex, Delhi",
      targetUnits: 100,
      registeredDonors: 135,
      status: "Completed",
    },
  ]);

  const [newCamp, setNewCamp] = useState({
    name: "",
    organizer: "",
    date: "",
    time: "09:00 AM – 04:00 PM",
    location: "",
    targetUnits: 100,
  });

  const handleCreateCamp = (e) => {
    e.preventDefault();
    if (!newCamp.name || !newCamp.date || !newCamp.location) return;

    const created = {
      id: `CAMP-${100 + camps.length + 1}`,
      name: newCamp.name,
      organizer: newCamp.organizer || "BloodConnect Community",
      date: newCamp.date,
      time: newCamp.time,
      location: newCamp.location,
      targetUnits: Number(newCamp.targetUnits) || 100,
      registeredDonors: 0,
      status: "Upcoming",
    };

    setCamps([created, ...camps]);
    setShowModal(false);
    setNewCamp({ name: "", organizer: "", date: "", time: "09:00 AM – 04:00 PM", location: "", targetUnits: 100 });
  };

  return (
    <div className="admin-view-container">
      <div className="admin-view-header">
        <div>
          <h2>Blood Donation Camps & Drives</h2>
          <p>Organize, schedule and monitor mobile blood collection camps across community centers and corporate campuses.</p>
        </div>
        <div className="admin-view-actions">
          <button className="admin-btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Schedule Blood Camp
          </button>
        </div>
      </div>

      <div className="admin-camps-grid">
        {camps.map((camp) => {
          const progress = Math.min(100, Math.round((camp.registeredDonors / camp.targetUnits) * 100));
          return (
            <div key={camp.id} className="admin-camp-card">
              <div className="admin-camp-header">
                <div className="admin-camp-badge-row">
                  <span className={`admin-status-pill ${camp.status.toLowerCase()}`}>
                    {camp.status === "Upcoming" ? <Sparkles size={12} /> : <CheckCircle size={12} />}
                    {camp.status}
                  </span>
                  <span className="admin-camp-id">{camp.id}</span>
                </div>
                <h3>{camp.name}</h3>
                <p className="admin-camp-organizer">Organized by: {camp.organizer}</p>
              </div>

              <div className="admin-camp-body">
                <div className="admin-camp-meta-item">
                  <CalendarDays size={15} />
                  <span>{camp.date}</span>
                </div>
                <div className="admin-camp-meta-item">
                  <Clock size={15} />
                  <span>{camp.time}</span>
                </div>
                <div className="admin-camp-meta-item">
                  <MapPin size={15} />
                  <span>{camp.location}</span>
                </div>

                <div className="admin-camp-progress-wrap">
                  <div className="admin-camp-progress-labels">
                    <span>Donor registrations: <strong>{camp.registeredDonors}</strong></span>
                    <span>Target: <strong>{camp.targetUnits} units</strong></span>
                  </div>
                  <div className="admin-camp-progress-bar">
                    <div
                      className="admin-camp-progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <small className="admin-subtext">{progress}% of quota reached</small>
                </div>
              </div>

              <div className="admin-camp-footer">
                <button
                  className="admin-btn-secondary admin-btn-sm"
                  onClick={() => alert(`Broadcasting camp notification to registered donors in ${camp.location.split(',')[1] || 'area'}...`)}
                >
                  Broadcast Alerts
                </button>
                <button
                  className="admin-btn-outline admin-btn-sm"
                  onClick={() => alert(`Downloading camp volunteer checklist for ${camp.id}...`)}
                >
                  Donor Manifest
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Schedule New Blood Camp</h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateCamp}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Camp / Drive Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. World Blood Donor Day Mega Drive"
                    value={newCamp.name}
                    onChange={(e) => setNewCamp({ ...newCamp, name: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Organizer / Partner NGO</label>
                  <input
                    type="text"
                    placeholder="e.g. Lions Club & BloodConnect"
                    value={newCamp.organizer}
                    onChange={(e) => setNewCamp({ ...newCamp, organizer: e.target.value })}
                  />
                </div>

                <div className="admin-modal-grid">
                  <div className="admin-form-group">
                    <label>Drive Date *</label>
                    <input
                      type="date"
                      required
                      value={newCamp.date}
                      onChange={(e) => setNewCamp({ ...newCamp, date: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Operational Hours</label>
                    <input
                      type="text"
                      placeholder="09:00 AM – 04:00 PM"
                      value={newCamp.time}
                      onChange={(e) => setNewCamp({ ...newCamp, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Full Venue Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Community Center, Sector 14, Gurugram"
                    value={newCamp.location}
                    onChange={(e) => setNewCamp({ ...newCamp, location: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Target Donation Units</label>
                  <input
                    type="number"
                    min="10"
                    value={newCamp.targetUnits}
                    onChange={(e) => setNewCamp({ ...newCamp, targetUnits: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="submit" className="admin-btn-primary">
                  <Plus size={15} /> Publish Camp
                </button>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
