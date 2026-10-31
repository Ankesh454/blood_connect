const Notification = require('../models/Notification');

const listNotifications = async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
  const [items, total, unread] = await Promise.all([
    Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Notification.countDocuments({ recipient: req.user._id }),
    Notification.countDocuments({ recipient: req.user._id, readAt: null }),
  ]);
  return res.json({ items, total, unread, page, limit });
};
const markRead = async (req, res) => {
  const notification = await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { $set: { readAt: new Date() } }, { new: true });
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  return res.json(notification);
};
const markAllRead = async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, readAt: null }, { $set: { readAt: new Date() } });
  return res.json({ message: 'Notifications marked as read' });
};
module.exports = { listNotifications, markRead, markAllRead };
