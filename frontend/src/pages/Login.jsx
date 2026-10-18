
import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  function handleSubmit(e) {
    e.preventDefault();
    alert("Login form ready. Backend API integration is pending.");
    console.log(form);
  }

  return (
    <section className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-icon"><LogIn /></div>
        <h1>Welcome Back</h1>
        <p>Login to continue to BloodConnect.</p>

        <label>Email Address</label>
        <input type="email" required placeholder="you@example.com"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />

        <label>Password</label>
        <input type="password" required placeholder="Enter your password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} />

        <button className="btn btn-primary full-btn" type="submit">
          Login
        </button>
        <p className="form-bottom">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </section>
  );
}
