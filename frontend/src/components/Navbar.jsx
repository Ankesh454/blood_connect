import { Link, NavLink } from "react-router-dom";
import { Droplets, Menu, X, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Hospitals", path: "/hospitals" },
    { name: "Donation", path: "/donation" },
    { name: "Blood Camps", path: "/blood-camps" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  return (
    <header className="navbar">
      <Link to="/" className="brand" onClick={() => setOpen(false)}>
        <span className="brand-icon-wrap">
          <Droplets size={22} />
        </span>
        <span>Blood<span className="brand-dark">Connect</span></span>
      </Link>

      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? <X /> : <Menu />}
      </button>

      <nav className={open ? "nav-links open" : "nav-links"}>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/"}
            onClick={() => setOpen(false)}
          >
            {link.name}
          </NavLink>
        ))}
        <Link className="nav-emergency" to="/create-request" onClick={() => setOpen(false)} style={{ background: '#fff1f2', color: '#e11d48', border: '1px solid #ffe4e6' }}>
          <AlertCircle size={15} /> Emergency
        </Link>
        <Link className="nav-login" to="/login" onClick={() => setOpen(false)}>
          Login
        </Link>
        <Link className="nav-signup" to="/signup" onClick={() => setOpen(false)}>
          Join as Donor
        </Link>
      </nav>
    </header>
  );
}