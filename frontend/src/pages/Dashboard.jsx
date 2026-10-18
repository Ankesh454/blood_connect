
import { Link } from "react-router-dom";
import { Droplets, Hospital, HeartHandshake, Bell, PlusCircle } from "lucide-react";

export default function Dashboard() {
  const actions = [
    { title: "Request Blood", text: "Create a new blood request.", path: "/create-request", icon: <PlusCircle /> },
    { title: "Hospitals", text: "Explore hospital information.", path: "/hospitals", icon: <Hospital /> },
    { title: "Donation", text: "Learn about donating blood.", path: "/donation", icon: <HeartHandshake /> },
    { title: "Notifications", text: "View your updates.", path: "/notifications", icon: <Bell /> }
  ];

  return (
    <section className="section dashboard">
      <span className="eyebrow">YOUR SPACE</span>
      <h1>Dashboard</h1>
      <p>Manage your BloodConnect activities from one place.</p>

      <div className="stats-grid">
        <div className="stat-card"><Droplets /><strong>—</strong><span>Blood Requests</span></div>
        <div className="stat-card"><HeartHandshake /><strong>—</strong><span>Donations</span></div>
        <div className="stat-card"><Bell /><strong>—</strong><span>Notifications</span></div>
      </div>

      <h2 className="subheading">Quick Actions</h2>
      <div className="feature-grid">
        {actions.map(action => (
          <Link className="feature-card" to={action.path} key={action.path}>
            <div className="feature-icon">{action.icon}</div>
            <h3>{action.title}</h3>
            <p>{action.text}</p>
          </Link>
        ))}
      </div>
      <p className="notice">Your personal records will appear here after authentication and backend integration.</p>
    </section>
  );
}
