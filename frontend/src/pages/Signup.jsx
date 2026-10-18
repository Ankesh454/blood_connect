
import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", bloodGroup: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert("Signup form ready. Backend API integration is pending.");
    console.log(form);
  }

  return (
    <section className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-icon"><UserPlus /></div>
        <h1>Create Account</h1>
        <p>Join BloodConnect and make a difference.</p>

        <label>Full Name</label>
        <input name="name" value={form.name} onChange={handleChange}
          placeholder="Enter your full name" required />

        <label>Email Address</label>
        <input name="email" type="email" value={form.email}
          onChange={handleChange} placeholder="you@example.com" required />

        <label>Phone Number</label>
        <input name="phone" type="tel" value={form.phone}
          onChange={handleChange} placeholder="Enter phone number" required />

        <label>Blood Group</label>
        <select name="bloodGroup" value={form.bloodGroup}
          onChange={handleChange} required>
          <option value="">Select blood group</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group =>
            <option key={group} value={group}>{group}</option>
          )}
        </select>

        <label>Password</label>
        <input name="password" type="password" value={form.password}
          onChange={handleChange} placeholder="Create a password"
          minLength={8} required />

        <button className="btn btn-primary full-btn" type="submit">
          Create Account
        </button>
        <p className="form-bottom">
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </form>
    </section>
  );
}
