
import { useState } from "react";
import { Droplets } from "lucide-react";

export default function CreateRequest() {
  const [form, setForm] = useState({
    patientName: "", bloodGroup: "", units: "1",
    hospital: "", city: "", contact: "", urgency: "Normal"
  });

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    console.log(form);
    alert("Request form ready. Backend integration is pending.");
  }

  return (
    <section className="form-page">
      <form className="form-card wide-form" onSubmit={submit}>
        <div className="form-icon"><Droplets /></div>
        <h1>Request Blood</h1>
        <p>Enter the details needed to raise a blood request.</p>

        <label>Patient Name</label>
        <input name="patientName" value={form.patientName}
          onChange={update} required placeholder="Patient's name" />

        <label>Required Blood Group</label>
        <select name="bloodGroup" value={form.bloodGroup}
          onChange={update} required>
          <option value="">Select blood group</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g =>
            <option key={g}>{g}</option>
          )}
        </select>

        <label>Units Required</label>
        <input name="units" type="number" min="1" max="20"
          value={form.units} onChange={update} required />

        <label>Hospital Name</label>
        <input name="hospital" value={form.hospital}
          onChange={update} required placeholder="Hospital name" />

        <label>City</label>
        <input name="city" value={form.city}
          onChange={update} required placeholder="City" />

        <label>Contact Number</label>
        <input name="contact" type="tel" value={form.contact}
          onChange={update} required placeholder="Contact number" />

        <label>Urgency</label>
        <select name="urgency" value={form.urgency} onChange={update}>
          <option>Normal</option>
          <option>Urgent</option>
          <option>Emergency</option>
        </select>

        <button className="btn btn-primary full-btn" type="submit">
          Submit Blood Request
        </button>
      </form>
    </section>
  );
}
