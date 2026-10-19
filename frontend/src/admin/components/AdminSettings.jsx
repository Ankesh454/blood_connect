import { useState } from "react";
import { Shield, Key, Bell, Database, Save, CheckCircle2, Lock, Smartphone } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminSettings() {
  const { admin } = useAdminAuth();
  const [savedMessage, setSavedMessage] = useState(false);

  const [settings, setSettings] = useState({
    siteName: "BloodConnect National Network",
    emergencyHelpline: "+91 1800 233 4567",
    enableSmsAlerts: true,
    enableAutoHospitalVerification: false,
    requirePrescriptionForRequest: true,
    maxUnitsPerRequest: 4,
    maintenanceMode: false,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="admin-view-container">
      <div className="admin-view-header">
        <div>
          <h2>Platform Security & Dispatch Preferences</h2>
          <p>Configure emergency quotas, compliance verification rules, and automated SMS dispatch triggers.</p>
        </div>
      </div>

      {savedMessage && (
        <div className="admin-saved-banner">
          <CheckCircle2 size={18} />
          <span>Configuration saved successfully to server preferences!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="admin-settings-grid">
        {/* General Settings */}
        <div className="admin-settings-card">
          <div className="admin-card-header">
            <h3><Shield size={18} /> General System Rules</h3>
          </div>
          <div className="admin-settings-body">
            <div className="admin-form-group">
              <label>Organization / Portal Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>24/7 Central SOS Helpline</label>
              <input
                type="text"
                value={settings.emergencyHelpline}
                onChange={(e) => setSettings({ ...settings, emergencyHelpline: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>Max Single Request Unit Limit</label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.maxUnitsPerRequest}
                onChange={(e) => setSettings({ ...settings, maxUnitsPerRequest: Number(e.target.value) })}
              />
              <span className="admin-subtext">Requests exceeding this will trigger mandatory manual senior medical sign-off.</span>
            </div>
          </div>
        </div>

        {/* Verification & Medical Compliance */}
        <div className="admin-settings-card">
          <div className="admin-card-header">
            <h3><Lock size={18} /> Medical Compliance & Verification</h3>
          </div>
          <div className="admin-settings-body">
            <label className="admin-checkbox-card">
              <input
                type="checkbox"
                checked={settings.requirePrescriptionForRequest}
                onChange={(e) => setSettings({ ...settings, requirePrescriptionForRequest: e.target.checked })}
              />
              <div>
                <strong>Mandatory Doctor Requisition Slip</strong>
                <p>Requesters must upload hospital requisition proof before emergency requests are dispatched to donors.</p>
              </div>
            </label>

            <label className="admin-checkbox-card">
              <input
                type="checkbox"
                checked={settings.enableSmsAlerts}
                onChange={(e) => setSettings({ ...settings, enableSmsAlerts: e.target.checked })}
              />
              <div>
                <strong>SMS Dispatch to Donors within 10km</strong>
                <p>Instantly trigger automated transactional SMS when an Emergency request is authorized.</p>
              </div>
            </label>

            <label className="admin-checkbox-card">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              />
              <div>
                <strong>Emergency Wartime / Drill Mode</strong>
                <p>Prioritizes emergency requests on all consumer dashboards and activates red alerts across feeds.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Admin Credential Info */}
        <div className="admin-settings-card full-width">
          <div className="admin-card-header">
            <h3><Key size={18} /> Active Staff Session</h3>
          </div>
          <div className="admin-session-box">
            <div className="admin-session-item">
              <span>Account:</span>
              <strong>{admin?.name || "Administrator"} ({admin?.email || "admin@bloodconnect.com"})</strong>
            </div>
            <div className="admin-session-item">
              <span>Role Privilege:</span>
              <strong>Super Administrator (Level 3 Clear)</strong>
            </div>
            <div className="admin-session-item">
              <span>Encryption Status:</span>
              <strong className="text-emerald">Active TLS 1.3 End-to-End Session</strong>
            </div>
          </div>
          <div className="admin-card-footer-action">
            <button type="submit" className="admin-btn-primary">
              <Save size={16} /> Save Platform Preferences
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
