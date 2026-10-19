import { useState } from "react";
import { Hospital, MapPin, Phone, CheckCircle2, Plus, Search, Building2, ShieldCheck, Activity } from "lucide-react";

export default function HospitalManagement() {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [hospitals, setHospitals] = useState([
    {
      id: "HOSP-01",
      name: "City Care Super Specialty Hospital",
      city: "Delhi",
      district: "South Delhi",
      phone: "+91 11 2659 8800",
      bloodBankContact: "+91 98110 11223",
      verified: true,
      stockUnits: 142,
      criticalGroups: ["O-", "AB-"],
    },
    {
      id: "HOSP-02",
      name: "Apollo Metro Medical Center",
      city: "Gurugram",
      district: "Sector 29",
      phone: "+91 124 456 7890",
      bloodBankContact: "+91 98220 22334",
      verified: true,
      stockUnits: 89,
      criticalGroups: ["B-"],
    },
    {
      id: "HOSP-03",
      name: "LifeLine Multi-Care Hospital",
      city: "Noida",
      district: "Sector 62",
      phone: "+91 120 789 0123",
      bloodBankContact: "+91 98330 33445",
      verified: true,
      stockUnits: 65,
      criticalGroups: ["A-", "O-"],
    },
    {
      id: "HOSP-04",
      name: "General Civil Hospital",
      city: "Panipat",
      district: "GT Road",
      phone: "+91 180 264 5500",
      bloodBankContact: "+91 98440 44556",
      verified: false,
      stockUnits: 34,
      criticalGroups: ["O+", "O-", "B-"],
    },
  ]);

  const [newHosp, setNewHosp] = useState({
    name: "",
    city: "",
    district: "",
    phone: "",
    bloodBankContact: "",
    stockUnits: 50,
  });

  const handleAddHospital = (e) => {
    e.preventDefault();
    if (!newHosp.name || !newHosp.city) return;

    const created = {
      id: `HOSP-0${hospitals.length + 1}`,
      name: newHosp.name,
      city: newHosp.city,
      district: newHosp.district || "Central",
      phone: newHosp.phone || "+91 11 2000 0000",
      bloodBankContact: newHosp.bloodBankContact || "+91 99999 88888",
      verified: true,
      stockUnits: Number(newHosp.stockUnits) || 40,
      criticalGroups: ["O-"],
    };

    setHospitals([created, ...hospitals]);
    setShowAddModal(false);
    setNewHosp({ name: "", city: "", district: "", phone: "", bloodBankContact: "", stockUnits: 50 });
  };

  const filteredHospitals = hospitals.filter((h) => {
    const q = search.toLowerCase();
    return (
      h.name.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      h.district.toLowerCase().includes(q)
    );
  });

  return (
    <div className="admin-view-container">
      <div className="admin-view-header">
        <div>
          <h2>Partner Hospitals & Blood Banks</h2>
          <p>Supervise empanelled medical institutes, emergency blood bank contacts, and inventory reserve health.</p>
        </div>
        <div className="admin-view-actions">
          <button
            className="admin-btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} /> Empanel New Hospital
          </button>
        </div>
      </div>

      <div className="admin-filters-bar">
        <div className="admin-search-input-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search hospital name, city, or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="admin-cards-grid">
        {filteredHospitals.map((hosp) => (
          <div key={hosp.id} className="admin-hospital-card">
            <div className="admin-hosp-header">
              <div className="admin-hosp-icon">
                <Building2 size={22} />
              </div>
              <div className="admin-hosp-meta">
                <div className="admin-hosp-title-row">
                  <h4>{hosp.name}</h4>
                  {hosp.verified && (
                    <span className="admin-verified-tag" title="Verified Medical Partner">
                      <ShieldCheck size={13} /> Verified
                    </span>
                  )}
                </div>
                <div className="admin-hosp-location">
                  <MapPin size={13} /> {hosp.district}, {hosp.city}
                </div>
              </div>
            </div>

            <div className="admin-hosp-body">
              <div className="admin-hosp-metric-row">
                <div className="admin-metric-box">
                  <span className="admin-metric-title">Blood Stock</span>
                  <strong className="admin-metric-value">{hosp.stockUnits} units</strong>
                </div>
                <div className="admin-metric-box">
                  <span className="admin-metric-title">Critical Needs</span>
                  <div className="admin-crit-tags">
                    {hosp.criticalGroups.map((grp) => (
                      <span key={grp} className="admin-crit-badge">{grp}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="admin-hosp-contact-list">
                <div className="admin-contact-row">
                  <Phone size={13} />
                  <span>Reception: {hosp.phone}</span>
                </div>
                <div className="admin-contact-row">
                  <Activity size={13} />
                  <span>24x7 Blood Bank: {hosp.bloodBankContact}</span>
                </div>
              </div>
            </div>

            <div className="admin-hosp-footer">
              <span className="admin-code-tag">{hosp.id}</span>
              <button
                className="admin-btn-secondary admin-btn-sm"
                onClick={() => alert(`Syncing live blood bank stock for ${hosp.name}...`)}
              >
                Sync Inventory
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Hospital Modal */}
      {showAddModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Empanel New Hospital</h3>
              <button className="admin-modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddHospital}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Hospital Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Max Super Speciality Hospital"
                    value={newHosp.name}
                    onChange={(e) => setNewHosp({ ...newHosp, name: e.target.value })}
                  />
                </div>

                <div className="admin-modal-grid">
                  <div className="admin-form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. New Delhi"
                      value={newHosp.city}
                      onChange={(e) => setNewHosp({ ...newHosp, city: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>District / Sector</label>
                    <input
                      type="text"
                      placeholder="e.g. Saket"
                      value={newHosp.district}
                      onChange={(e) => setNewHosp({ ...newHosp, district: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-modal-grid">
                  <div className="admin-form-group">
                    <label>Hospital Phone</label>
                    <input
                      type="text"
                      placeholder="+91 11 2650 0000"
                      value={newHosp.phone}
                      onChange={(e) => setNewHosp({ ...newHosp, phone: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Blood Bank 24/7 Hotline</label>
                    <input
                      type="text"
                      placeholder="+91 98111 22233"
                      value={newHosp.bloodBankContact}
                      onChange={(e) => setNewHosp({ ...newHosp, bloodBankContact: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Initial Estimated Stock (Units)</label>
                  <input
                    type="number"
                    min="0"
                    value={newHosp.stockUnits}
                    onChange={(e) => setNewHosp({ ...newHosp, stockUnits: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="submit" className="admin-btn-primary">
                  <Plus size={15} /> Save Hospital
                </button>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setShowAddModal(false)}
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
