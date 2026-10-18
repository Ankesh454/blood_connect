
import { useState } from "react";
import { Hospital, Search, MapPin, Phone } from "lucide-react";

export default function Hospitals() {
  const [search, setSearch] = useState("");

  // Replace with hospitals fetched from the backend.
  const hospitals = [];

  const filtered = hospitals.filter(h =>
    `${h.name} ${h.city}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="section">
      <div className="section-heading">
        <span className="eyebrow">HEALTHCARE DIRECTORY</span>
        <h1>Find Hospitals</h1>
        <p>Explore hospitals and their contact information.</p>
      </div>

      <div className="search-box">
        <Search />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search hospital or city..." />
      </div>

      {filtered.length ? (
        <div className="feature-grid">
          {filtered.map(h => (
            <article className="feature-card" key={h._id}>
              <Hospital className="page-icon" />
              <h3>{h.name}</h3>
              <p><MapPin size={15} /> {h.address}, {h.city}</p>
              <p><Phone size={15} /> {h.phone}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Hospital size={42} />
          <h3>No hospital records yet</h3>
          <p>Hospital listings will appear here when hospital data is connected.</p>
        </div>
      )}
    </section>
  );
}
