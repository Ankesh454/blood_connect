
import { Link } from "react-router-dom";
import { HeartHandshake, CheckCircle, Droplets, CalendarDays } from "lucide-react";

export default function Donation() {
  const tips = [
    "Check your eligibility with a qualified healthcare professional.",
    "Stay hydrated and eat a balanced meal before donation.",
    "Carry valid identification if required by the donation centre.",
    "Follow the staff's aftercare instructions after donating."
  ];

  return (
    <section className="section">
      <div className="donation-hero">
        <div>
          <span className="eyebrow">BE A LIFESAVER</span>
          <h1>Give Blood. Give Hope.</h1>
          <p>
            Voluntary blood donation can help patients who need transfusions.
            Learn about donation and find your next step.
          </p>
          <Link to="/blood-camps" className="btn btn-primary">
            <CalendarDays size={18} /> Explore Blood Camps
          </Link>
        </div>
        <div className="donation-symbol"><HeartHandshake size={90} /></div>
      </div>

      <h2 className="subheading">Before You Donate</h2>
      <div className="tips-list">
        {tips.map(tip => (
          <div className="tip-item" key={tip}>
            <CheckCircle size={21} />
            <p>{tip}</p>
          </div>
        ))}
      </div>

      <div className="notice">
        Donation eligibility depends on medical criteria and local guidelines.
        The donation centre's healthcare staff will determine whether you can donate.
      </div>

      <div className="cta-section donation-cta">
        <div>
          <h2>Ready to take the next step?</h2>
          <p>Find a donation camp or register for a BloodConnect account.</p>
        </div>
        <Link to="/signup" className="btn btn-light">Join BloodConnect</Link>
      </div>
    </section>
  );
}
