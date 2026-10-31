const mongoose = require('mongoose');

const normalizeRole = (role) => (role === 'donor' || role === 'recipient' ? 'user' : role);

async function migrate() {
  const apply = process.argv.includes('--apply');
  const backupConfirmed = process.argv.includes('--backup-confirmed');
  if (!process.env.MONGO_URI) throw new Error('Set MONGO_URI to the intended database. This script does not load backend/.env.');
  if (apply && !backupConfirmed) throw new Error('Before applying, back up the database, then pass --backup-confirmed.');

  await mongoose.connect(process.env.MONGO_URI);
  try {
    const users = mongoose.connection.collection('users');
    const legacyRoles = await users.countDocuments({ role: { $in: ['donor', 'recipient'] } });
    const hospitalApprovalUpdates = await users.countDocuments({ role: 'hospital', $or: [{ approvalStatus: { $exists: false } }, { approvalStatus: 'none' }] });
    const summary = { mode: apply ? 'apply' : 'dry-run', legacyRolesToNormalize: legacyRoles, hospitalAccountsToMarkApproved: hospitalApprovalUpdates };

    if (!apply) {
      console.log(JSON.stringify(summary, null, 2));
      return;
    }

    const normalized = await users.updateMany(
      { role: { $in: ['donor', 'recipient'] } },
      { $set: { role: 'user', approvalStatus: 'none' }, $unset: { requestedRole: '' } },
    );
    const approved = await users.updateMany(
      { role: 'hospital', $or: [{ approvalStatus: { $exists: false } }, { approvalStatus: 'none' }] },
      { $set: { approvalStatus: 'approved' } },
    );
    console.log(JSON.stringify({ ...summary, normalizedUsers: normalized.modifiedCount, approvedHospitals: approved.modifiedCount }, null, 2));
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  migrate().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = { normalizeRole };
