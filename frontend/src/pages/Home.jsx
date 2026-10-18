import { useState } from "react";
import { Link } from "react-router-dom";
import {
   ArrowRight, HeartHandshake, Hospital, MapPin,
   Droplets, ShieldCheck, Users, Activity, CheckCircle2,
   Clock, Sparkles, AlertCircle
} from "lucide-react";

export default function Home() {
  const [selectedGroup, setSelectedGroup] = useState("O+");

  const bloodCompatibility = {
    "O-": { give: ["All Blood Types (Universal)"], receive: ["O-"] },
    "O+": { give: ["O+", "A+", "B+", "AB+"], receive: ["O+", "O-"] },
    "A-": { give: ["A+", "A-", "AB+", "AB-"], receive: ["A-", "O-"] },
    "A+": { give: ["A+", "AB+"], receive: ["A+", "A-", "O+", "O-"] },
    "B-": { give: ["B+", "B-", "AB+", "AB-"], receive: ["B-", "O-"] },
    "B+": { give: ["B+", "AB+"], receive: ["B+", "B-", "O+", "O-"] },
    "AB-": { give: ["AB+", "AB-"], receive: ["AB-", "A-", "B-", "O-"] },
    "AB+": { give: ["AB+"], receive: ["All Blood Types (Universal)"] }
  };

  const groups = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

  return (
    <>
      {/* Urgent Request Real-time Notification Continuous Marquee Ticker */}
      <div className="ticker-banner">
        <div className="ticker-fixed-badge">
          <span className="ticker-badge"><AlertCircle size={13} /> LIVE EMERGENCY TICKER</span>
        </div>
        <div className="ticker-scroll-track">
          <div className="ticker-group">
            <div className="ticker-item">
              <span className="ticker-blood-pill">O- Universal</span>
              <span>Needed Urgently at Metro Trauma Center (3 Units)</span>
              <Link to="/create-request" className="ticker-action-link">Respond Now <ArrowRight size={12} /></Link>
            </div>
            <div className="ticker-item">
              <span className="ticker-blood-pill">B+ Critical</span>
              <span>City Children's Hospital ICU (2 Units required)</span>
              <Link to="/create-request" className="ticker-action-link">Respond Now <ArrowRight size={12} /></Link>
            </div>
            <div className="ticker-item">
              <span className="ticker-blood-pill">A- Needed</span>
              <span>Apollo Heart Institute, Bangalore</span>
              <Link to="/create-request" className="ticker-action-link">Respond Now <ArrowRight size={12} /></Link>
            </div>
            <div className="ticker-item">
              <span className="ticker-blood-pill">AB+ Platelets</span>
              <span>Max Super Specialty, Delhi</span>
              <Link to="/create-request" className="ticker-action-link">Respond Now <ArrowRight size={12} /></Link>
            </div>
          </div>

          {/* Seamless duplicate for continuous looping */}
          <div className="ticker-group" aria-hidden="true">
            <div className="ticker-item">
              <span className="ticker-blood-pill">O- Universal</span>
              <span>Needed Urgently at Metro Trauma Center (3 Units)</span>
              <Link to="/create-request" className="ticker-action-link">Respond Now <ArrowRight size={12} /></Link>
            </div>
            <div className="ticker-item">
              <span className="ticker-blood-pill">B+ Critical</span>
              <span>City Children's Hospital ICU (2 Units required)</span>
              <Link to="/create-request" className="ticker-action-link">Respond Now <ArrowRight size={12} /></Link>
            </div>
            <div className="ticker-item">
              <span className="ticker-blood-pill">A- Needed</span>
              <span>Apollo Heart Institute, Bangalore</span>
              <Link to="/create-request" className="ticker-action-link">Respond Now <ArrowRight size={12} /></Link>
            </div>
            <div className="ticker-item">
              <span className="ticker-blood-pill">AB+ Platelets</span>
              <span>Max Super Specialty, Delhi</span>
              <Link to="/create-request" className="ticker-action-link">Respond Now <ArrowRight size={12} /></Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow"><Sparkles size={14} /> Life-Saving Network</span>
          <h1>Your Blood Can Give Someone <span>Another Chance at Life.</span></h1>
          <p>
            BloodConnect bridges the gap between generous donors, registered hospitals, 
            and families in urgent need. Safe, transparent, and built for instant response.
          </p>
          <div className="hero-actions">
            <Link to="/create-request" className="btn btn-primary">
              <Droplets size={18} /> Request Blood Fast
            </Link>
            <Link to="/donation" className="btn btn-outline">
              Become a Registered Donor
            </Link>
          </div>
          <div className="hero-note">
            <ShieldCheck size={18} /> 100% Verified medical institutions &amp; voluntary donors.
          </div>
        </div>

        <div className="hero-art">
          <div className="hero-glow-ring"></div>
          <div className="blood-drop">
            <Droplets size={95} />
          </div>
          <div className="floating-card card-top">
            <div className="floating-card-icon">
              <HeartHandshake size={22} />
            </div>
            <div>
              <strong>Quick Match</strong>
              <small>Donors notified in ~3 mins</small>
            </div>
          </div>
          <div className="floating-card card-bottom">
            <div className="floating-card-icon">
              <Users size={22} />
            </div>
            <div>
              <strong>Verified Network</strong>
              <small>5,200+ Active volunteers</small>
            </div>
          </div>
        </div>
      </section>

      {/* Eyecatching Continuous Running Card Marquee Showcase */}
      <section style={{ padding: '30px 0 10px', background: 'linear-gradient(180deg, #f8fafc 0%, #fafbfc 100%)' }}>
        <div style={{ textAlign: 'center', marginBottom: '14px', padding: '0 20px' }}>
          <span className="eyebrow"><Activity size={13} /> LIVE ACTIVITY RADAR</span>
          <h3 style={{ margin: '10px 0 4px', fontSize: '20px' }}>Real-time Emergency Matches &amp; Certified Donors</h3>
          <p style={{ margin: 0, fontSize: '13px' }}>Cards continuously stream across all devices — tap or hover any card to inspect details.</p>
        </div>

        {/* Continuous Running Cards Strip (Track 1) */}
        <div className="cards-marquee-wrapper">
          <div className="cards-marquee-track">
            {/* Card Set 1 */}
            <div className="marquee-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="blood-tag give">Match Verified</span>
                <span style={{ fontSize: '11px', color: 'var(--red)', fontWeight: 800 }}>URGENT</span>
              </div>
              <h4 style={{ margin: '0 0 6px', fontSize: '15px' }}>O+ Needed for Heart Surgery</h4>
              <p style={{ fontSize: '12px', margin: '0 0 12px' }}>Lilavati Hospital • Mumbai</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <span>Required: 2 Units</span>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>2 Donors En Route</span>
              </div>
            </div>

            <div className="marquee-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="blood-tag receive">New Donor</span>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800 }}>AVAILABLE</span>
              </div>
              <h4 style={{ margin: '0 0 6px', fontSize: '15px' }}>Rahul S. (A+ Verified)</h4>
              <p style={{ fontSize: '12px', margin: '0 0 12px' }}>Available within 10km radius • Delhi NCR</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <span>6x Certified Donor</span>
                <span style={{ color: 'var(--red)', fontWeight: 700 }}>Active Now</span>
              </div>
            </div>

            <div className="marquee-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="blood-tag give">Camp Drive</span>
                <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 800 }}>THIS WEEK</span>
              </div>
              <h4 style={{ margin: '0 0 6px', fontSize: '15px' }}>Rotary Mega Blood Drive</h4>
              <p style={{ fontSize: '12px', margin: '0 0 12px' }}>Tech Park Gate 2 • Bangalore</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <span>Goal: 200 Units</span>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>142 Registered</span>
              </div>
            </div>

            <div className="marquee-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="blood-tag give">Rare Match</span>
                <span style={{ fontSize: '11px', color: 'var(--red)', fontWeight: 800 }}>CRITICAL</span>
              </div>
              <h4 style={{ margin: '0 0 6px', fontSize: '15px' }}>AB- Emergency Pediatric</h4>
              <p style={{ fontSize: '12px', margin: '0 0 12px' }}>Apollo Multi-Specialty • Pune</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <span>Required: 1 Unit</span>
                <span style={{ color: '#d97706', fontWeight: 700 }}>1 Donor Responded</span>
              </div>
            </div>

            {/* Duplicate for infinite loop */}
            <div className="marquee-card" aria-hidden="true">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="blood-tag give">Match Verified</span>
                <span style={{ fontSize: '11px', color: 'var(--red)', fontWeight: 800 }}>URGENT</span>
              </div>
              <h4 style={{ margin: '0 0 6px', fontSize: '15px' }}>O+ Needed for Heart Surgery</h4>
              <p style={{ fontSize: '12px', margin: '0 0 12px' }}>Lilavati Hospital • Mumbai</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <span>Required: 2 Units</span>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>2 Donors En Route</span>
              </div>
            </div>

            <div className="marquee-card" aria-hidden="true">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="blood-tag receive">New Donor</span>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800 }}>AVAILABLE</span>
              </div>
              <h4 style={{ margin: '0 0 6px', fontSize: '15px' }}>Rahul S. (A+ Verified)</h4>
              <p style={{ fontSize: '12px', margin: '0 0 12px' }}>Available within 10km radius • Delhi NCR</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <span>6x Certified Donor</span>
                <span style={{ color: 'var(--red)', fontWeight: 700 }}>Active Now</span>
              </div>
            </div>

            <div className="marquee-card" aria-hidden="true">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="blood-tag give">Camp Drive</span>
                <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 800 }}>THIS WEEK</span>
              </div>
              <h4 style={{ margin: '0 0 6px', fontSize: '15px' }}>Rotary Mega Blood Drive</h4>
              <p style={{ fontSize: '12px', margin: '0 0 12px' }}>Tech Park Gate 2 • Bangalore</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <span>Goal: 200 Units</span>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>142 Registered</span>
              </div>
            </div>

            <div className="marquee-card" aria-hidden="true">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="blood-tag give">Rare Match</span>
                <span style={{ fontSize: '11px', color: 'var(--red)', fontWeight: 800 }}>CRITICAL</span>
              </div>
              <h4 style={{ margin: '0 0 6px', fontSize: '15px' }}>AB- Emergency Pediatric</h4>
              <p style={{ fontSize: '12px', margin: '0 0 12px' }}>Apollo Multi-Specialty • Pune</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <span>Required: 1 Unit</span>
                <span style={{ color: '#d97706', fontWeight: 700 }}>1 Donor Responded</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Impact Counter */}
      <section className="impact-strip">
        <div className="impact-grid">
          <div>
            <div className="impact-stat-number">12,400<span>+</span></div>
            <div className="impact-stat-label">Donations Completed</div>
          </div>
          <div>
            <div className="impact-stat-number">450<span>+</span></div>
            <div className="impact-stat-label">Partner Hospitals</div>
          </div>
          <div>
            <div className="impact-stat-number">18<span>min</span></div>
            <div className="impact-stat-label">Avg. Match Time</div>
          </div>
          <div>
            <div className="impact-stat-number">99.8<span>%</span></div>
            <div className="impact-stat-label">Fulfillment Rate</div>
          </div>
        </div>
      </section>

      {/* What You Can Do Features with Mobile Horizontal Scroll Support */}
      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">ONE PURPOSE</span>
          <h2>Intuitive tools built for every emergency</h2>
          <p>Whether you are seeking blood, organizing a drive, or donating, BloodConnect guides you smoothly.</p>
        </div>
        <div className="feature-grid mobile-scroll-row">
          <Link to="/create-request" className="feature-card">
            <div>
              <div className="feature-icon"><Droplets /></div>
              <h3>Request Blood</h3>
              <p>Submit an emergency or scheduled requirement with target blood group and location.</p>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--red)', fontWeight: 700, fontSize: '13px' }}>
              Make a request <ArrowRight size={15} />
            </span>
          </Link>
          <Link to="/hospitals" className="feature-card">
            <div>
              <div className="feature-icon"><Hospital /></div>
              <h3>Find Hospitals</h3>
              <p>Search accredited hospitals, emergency blood bank contacts, and bed inventory.</p>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--red)', fontWeight: 700, fontSize: '13px' }}>
              Explore directory <ArrowRight size={15} />
            </span>
          </Link>
          <Link to="/donation" className="feature-card">
            <div>
              <div className="feature-icon"><HeartHandshake /></div>
              <h3>Donate Blood</h3>
              <p>Check health eligibility checklist, prepare for donation, and earn certified donor badges.</p>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--red)', fontWeight: 700, fontSize: '13px' }}>
              Eligibility check <ArrowRight size={15} />
            </span>
          </Link>
          <Link to="/blood-camps" className="feature-card">
            <div>
              <div className="feature-icon"><MapPin /></div>
              <h3>Blood Camps</h3>
              <p>Participate in local community drives, university blood camps, and mobile donor vans.</p>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--red)', fontWeight: 700, fontSize: '13px' }}>
              Find camp drives <ArrowRight size={15} />
            </span>
          </Link>
        </div>
      </section>

      {/* Interactive Blood Compatibility Matrix */}
      <section className="section" style={{ paddingTop: '10px' }}>
        <div className="section-heading">
          <span className="eyebrow">KNOWLEDGE HUB</span>
          <h2>Interactive Blood Compatibility Guide</h2>
          <p>Select a blood group to immediately understand who can give and receive safely.</p>
        </div>

        <div className="matrix-container">
          <div className="matrix-selector">
            {groups.map(group => (
              <button
                key={group}
                className={`blood-btn ${selectedGroup === group ? "active" : ""}`}
                onClick={() => setSelectedGroup(group)}
              >
                {group}
              </button>
            ))}
          </div>

          <div className="matrix-results">
            <div className="matrix-column can-give">
              <h4>
                <CheckCircle2 size={18} color="#16a34a" /> 
                {selectedGroup} can donate blood to:
              </h4>
              <div className="pill-group">
                {bloodCompatibility[selectedGroup].give.map(item => (
                  <span key={item} className="blood-tag give">{item}</span>
                ))}
              </div>
            </div>

            <div className="matrix-column can-receive">
              <h4>
                <Activity size={18} color="#2563eb" /> 
                {selectedGroup} can receive blood from:
              </h4>
              <div className="pill-group">
                {bloodCompatibility[selectedGroup].receive.map(item => (
                  <span key={item} className="blood-tag receive">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Testimonials with Continuous Marquee effect on small/medium screens */}
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="section-heading">
          <span className="eyebrow">COMMUNITY VOICES</span>
          <h2>Real Stories, Real Lives Saved</h2>
          <p>Hear from patients, families, and everyday donor heroes across the network.</p>
        </div>
        <div className="testimonials-grid mobile-scroll-row">
          <div className="testimonial-card">
            <p className="testimonial-quote">
              &quot;When my mother underwent emergency surgery, we needed 3 units of B+ within 45 minutes. BloodConnect matched us with two nearby donors who arrived directly at the hospital.&quot;
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">RD</div>
              <div className="author-meta">
                <strong>Rohan Deshmukh</strong>
                <small>Recipient Family • Mumbai</small>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <p className="testimonial-quote">
              &quot;I've donated 8 times over 3 years. The notifications are precise, respectful of my time, and knowing your blood directly helped a patient is the best feeling in the world.&quot;
            </p>
            <div className="testimonial-author">
              <div className="author-avatar" style={{ background: '#dcfce7', color: '#16a34a' }}>PS</div>
              <div className="author-meta">
                <strong>Priya Sharma</strong>
                <small>Regular Donor (O-) • Delhi</small>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <p className="testimonial-quote">
              &quot;Our hospital blood bank inventory coordination improved by 40% since connecting our verified drives. BloodConnect is indispensable in healthcare logistics.&quot;
            </p>
            <div className="testimonial-author">
              <div className="author-avatar" style={{ background: '#e0e7ff', color: '#4338ca' }}>DR</div>
              <div className="author-meta">
                <strong>Dr. Arvind Rao</strong>
                <small>Medical Superintendent • Bangalore</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="cta-section">
        <div>
          <span className="eyebrow">BE SOMEONE'S HOPE TODAY</span>
          <h2>Every single second counts. Join the life-saving chain.</h2>
          <p>Register as a volunteer donor or organize a blood camp in your institution today.</p>
        </div>
        <Link to="/signup" className="btn btn-light">
          Get Started Now <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}