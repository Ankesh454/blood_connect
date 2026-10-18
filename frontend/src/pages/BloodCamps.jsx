
import { useState } from "react";
import { CalendarDays, MapPin, Search } from "lucide-react";

export default function BloodCamps() {
  const [search, setSearch] = useState("");

  // Camp records will come from the separate Blood Camp model.
  const camps = [];

  const filtered = camps.filter(c =>
    `${c.name} ${c.city}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="section">
      <div className="section-heading">
        <span className="eyebrow">DONATE TOGETHER</span>
        <h1>Blood Donation Camps</h1>
        <p>Find information about upcoming donation events.</p>
      </div>

      <div className="search-box">
        <Search />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search camp or city..." />
      </div>

      {filtered.length ? (
        <div className="feature-grid">
          {filtered.map(c => (
            <article className="feature-card" key={c._id}>
              <div className="feature-icon"><CalendarDays /></div>
              <h3>{c.name}</h3>
              <p><CalendarDays size={15} /> {c.date}</p>
              <p><MapPin size={15} /> {c.address}, {c.city}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <CalendarDays size={42} />
          <h3>No camps to display</h3>
          <p>Upcoming camp information will appear here when available.</p>
        </div>
      )}
    </section>
  );
}
