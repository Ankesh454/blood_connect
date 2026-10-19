import { Link } from "react-router-dom";
import { Droplets } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <Link to="/" className="brand footer-brand">
          <Droplets size={25} />
          BloodConnect
        </Link>
        <p>Connecting blood donors with people who need them.</p>
      </div>

      <div className="footer-links">
        <Link to="/hospitals">Hospitals</Link>
        <Link to="/donation">Donation</Link>
        <Link to="/blood-camps">Blood Camps</Link>
        <Link to="/create-request">Request Blood</Link>
        <Link to="/admin/login" style={{ color: "#ef4444", fontWeight: 600 }}>Staff Portal</Link>
      </div>

      <p className="copyright">© {new Date().getFullYear()} BloodConnect</p>
    </footer>
  );
}