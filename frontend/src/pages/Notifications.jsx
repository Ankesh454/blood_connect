
import { Bell, CheckCheck } from "lucide-react";

export default function Notifications() {
  const notifications = [];

  return (
    <section className="section">
      <div className="section-heading">
        <span className="eyebrow">STAY UPDATED</span>
        <h1>Notifications</h1>
        <p>Updates related to your blood requests and donor activity.</p>
      </div>

      {notifications.length ? (
        <div className="notification-list">
          {notifications.map(n => (
            <article className="notification-item" key={n._id}>
              <Bell />
              <div>
                <h3>{n.title}</h3>
                <p>{n.message}</p>
                <small>{n.createdAt}</small>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <CheckCheck size={42} />
          <h3>You're all caught up!</h3>
          <p>Notifications will appear here when available.</p>
        </div>
      )}
    </section>
  );
}
