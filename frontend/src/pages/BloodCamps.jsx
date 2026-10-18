
import { useState } from "react";
import { CalendarDays, MapPin, Search, Clock, Users, ArrowRight, CheckCircle2 } from "lucide-react";

export default function BloodCamps() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [registeredCampId, setRegisteredCampId] = useState(null);

  // Modern rich sample camp records
  const sampleCamps = [
    {
      _id: "camp-1",
      name: "City Youth Red Cross Blood Drive",
      organizer: "Indian Red Cross Society",
      city: "Mumbai",
      address: "Bandra Kurla Complex Community Hall",
      date: "Oct 24, 2026",
      time: "9:00 AM - 4:00 PM",
      targetUnits: 150,
      registeredCount: 88,
      status: "Registration Open"
    },
    {
      _id: "camp-2",
      name: "Rotary Hope Mega Blood Camp",
      organizer: "Rotary Club Metro",
      city: "Delhi",
      address: "Civic Centre, Connaught Place",
      date: "Oct 27, 2026",
      time: "10:00 AM - 5:30 PM",
      targetUnits: 250,
      registeredCount: 194,
      status: "Registration Open"
    },
    {
      _id: "camp-3",
      name: "Tech Parks LifeSaver Camp",
      organizer: "Bangalore Healthcare Alliance",
      city: "Bangalore",
      address: "Ecospace Tech Park, Bellandur",
      date: "Nov 02, 2026",
      time: "9:30 AM - 3:30 PM",
      targetUnits: 120,
      registeredCount: 76,
      status: "Registration Open"
    },
    {
      _id: "camp-4",
      name: "Apex Hospital Volunteer Drive",
      organizer: "Apex Multi-Specialty Hospital",
      city: "Pune",
      address: "Shivaji Nagar Ground, Near Metro Station",
      date: "Nov 06, 2026",
      time: "8:30 AM - 2:00 PM",
      targetUnits: 100,
      registeredCount: 42,
      status: "Registration Open"
    }
  ];

  const filtered = sampleCamps.filter(c => {
    const matchesSearch = `${c.name} ${c.city} ${c.organizer}`.toLowerCase().includes(search.toLowerCase());
    const matchesCity = selectedCity === "All" || c.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const cities = ["All", "Mumbai", "Delhi", "Bangalore", "Pune"];

  const handleRegister = (id) => {
    setRegisteredCampId(id);
    setTimeout(() => {
      setRegisteredCampId(null);
    }, 3500);
  };

  return (
    <section className="section">
      <div className="section-heading">
        <span className="eyebrow">COMMUNITY DRIVES</span>
        <h1>Upcoming Blood Donation Camps</h1>
        <p>Join localized donation events organized by certified hospitals and voluntary welfare societies.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', marginBottom: '35px' }}>
        <div className="search-box" style={{ width: '100%', maxWidth: '580px', margin: 0 }}>
          <Search />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by camp name, organizer, or city..."
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {cities.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 700,
                border: '1px solid var(--border)',
                background: selectedCity === city ? 'var(--red)' : 'white',
                color: selectedCity === city ? 'white' : 'var(--slate-700)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {filtered.length ? (
        <div className="feature-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {filtered.map(c => (
            <article className="feature-card" key={c._id}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div className="feature-icon"><CalendarDays /></div>
                  <span style={{
                    fontSize: '11px', fontWeight: 800, padding: '3px 9px',
                    borderRadius: '6px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0'
                  }}>
                    {c.status}
                  </span>
                </div>
                <h3 style={{ marginTop: '0', fontSize: '18px', lineHeight: 1.3 }}>{c.name}</h3>
                <small style={{ color: 'var(--red)', fontWeight: 700, display: 'block', marginBottom: '12px' }}>
                  Organized by {c.organizer}
                </small>

                <div style={{ display: 'grid', gap: '8px', margin: '14px 0', fontSize: '13px', color: 'var(--slate-600)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarDays size={15} color="var(--red)" />
                    <strong>{c.date}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={15} color="var(--muted)" />
                    <span>{c.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <MapPin size={15} color="var(--muted)" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <span>{c.address}, <strong>{c.city}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={15} color="var(--muted)" />
                    <span>{c.registeredCount} / {c.targetUnits} registered donors</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                {registeredCampId === c._id ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#16a34a', fontWeight: 700, fontSize: '13px', padding: '10px 0' }}>
                    <CheckCircle2 size={16} /> Slot Confirmed! See you there.
                  </div>
                ) : (
                  <button
                    onClick={() => handleRegister(c._id)}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '10px 14px', fontSize: '13px' }}
                  >
                    Register as Volunteer Donor <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <CalendarDays size={42} />
          <h3>No camps found matching criteria</h3>
          <p>Try searching for a different city or term, or check back soon.</p>
        </div>
      )}
    </section>
  );
}
