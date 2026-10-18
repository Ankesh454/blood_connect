import { Link } from "react-router-dom";
import {
  ArrowRight, HeartHandshake, Hospital, MapPin,
  Droplets, ShieldCheck, Users
} from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow"><HeartHandshake size={17} /> Every Drop Matters</span>
          <h1>Your Blood Can Give Someone <span>Another Chance at Life.</span></h1>
          <p>
            BloodConnect brings donors and people in need closer together.
            Find hospitals, discover donation camps and raise blood requests.
          </p>
          <div className="hero-actions">
            <Link to="/create-request" className="btn btn-primary">
              Request Blood <ArrowRight size={18} />
            </Link>
            <Link to="/donation" className="btn btn-outline">
              Become a Donor
            </Link>
          </div>
          <div className="hero-note">
            <ShieldCheck size={18} /> Help connect people when every moment matters.
          </div>
        </div>
        <div className="hero-art">
          <div className="blood-drop"><Droplets size={95} /></div>
          <div className="floating-card card-top">
            <HeartHandshake size={23} />
            <div><strong>Give Blood</strong><small>Share the gift of life</small></div>
          </div>
          <div className="floating-card card-bottom">
            <Users size={23} />
            <div><strong>Find Support</strong><small>Connect with donors</small></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">WHAT YOU CAN DO</span>
          <h2>One platform. Multiple ways to help.</h2>
          <p>Take the next step towards helping someone in need.</p>
        </div>
        <div className="feature-grid">
          <Link to="/create-request" className="feature-card">
            <div className="feature-icon"><Droplets /></div>
            <h3>Request Blood</h3>
            <p>Submit a blood request with the required blood group and location.</p>
            <span>Make a request <ArrowRight size={16} /></span>
          </Link>
          <Link to="/hospitals" className="feature-card">
            <div className="feature-icon"><Hospital /></div>
            <h3>Find Hospitals</h3>
            <p>Explore hospital information and available contact details.</p>
            <span>Explore hospitals <ArrowRight size={16} /></span>
          </Link>
          <Link to="/donation" className="feature-card">
            <div className="feature-icon"><HeartHandshake /></div>
            <h3>Donate Blood</h3>
            <p>Learn about donation and take steps towards becoming a donor.</p>
            <span>Learn more <ArrowRight size={16} /></span>
          </Link>
          <Link to="/blood-camps" className="feature-card">
            <div className="feature-icon"><MapPin /></div>
            <h3>Blood Camps</h3>
            <p>Explore blood donation camp details and event information.</p>
            <span>Explore camps <ArrowRight size={16} /></span>
          </Link>
        </div>
      </section>

      <section className="cta-section">
        <div>
          <span className="eyebrow">BE SOMEONE'S HOPE</span>
          <h2>Your small step can make a big difference.</h2>
          <p>Join BloodConnect and become part of a community that cares.</p>
        </div>
        <Link to="/signup" className="btn btn-light">Get Started <ArrowRight size={18} /></Link>
      </section>
    </>
  );
}