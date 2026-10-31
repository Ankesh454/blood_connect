const DonorCommitment = require('../models/DonorCommitment');
const BloodRequest = require('../models/BloodRequest');
const SOSAlert = require('../models/SOSAlert');
const Notification = require('../models/Notification');

// Users can participate as donors and hospitals see only responses linked to them.
const getCommitments = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'hospital') {
      query.hospital = req.user._id;
    } else if (req.user.role === 'user') {
      query.donor = req.user._id;
    } else {
      return res.status(403).json({ message: 'Only users and hospitals can view donor tracking.' });
    }
    const commitments = await DonorCommitment.find(query)
      .populate('donor', 'name email phone city bloodGroup')
      .sort({ createdAt: -1 });
    res.json(commitments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Donor commits to help with actual logged-in user details
const createCommitment = async (req, res) => {
  try {
    const { requestId, sosId } = req.body;

    // Any normal account may respond as a donor; availability is explicit here.
    if (!req.user || req.user.role !== 'user') {
      return res.status(403).json({ message: 'Only user accounts can respond as donors.' });
    }

    let details;
    if (requestId) {
      const request = await BloodRequest.findOne({ _id: requestId, status: 'Pending' });
      if (!request) return res.status(404).json({ message: 'This blood request is no longer active.' });
      details = {
        hospital: request.user,
        hospitalName: request.hospitalName,
        bloodGroup: request.bloodGroup,
        referenceType: 'General',
        referenceId: request._id,
        referenceLabel: request.patientName,
      };
    } else if (sosId) {
      const alert = await SOSAlert.findOne({ _id: sosId, status: 'Active' });
      if (!alert) return res.status(404).json({ message: 'This emergency alert is no longer active.' });
      if (alert.bloodGroup !== req.user.bloodGroup) return res.status(403).json({ message: 'Your registered blood group does not match this alert. Matching is not medical compatibility or eligibility.' });
      details = {
        hospital: alert.hospital,
        hospitalName: alert.hospitalName,
        bloodGroup: alert.bloodGroup,
        referenceType: 'SOS',
        referenceId: alert._id,
        referenceLabel: alert.message,
      };
    } else {
      return res.status(400).json({ message: 'Choose an active blood request or SOS alert to respond to.' });
    }

    const alreadyResponded = await DonorCommitment.findOne({
      donor: req.user._id,
      referenceType: details.referenceType,
      referenceId: details.referenceId,
    });
    if (alreadyResponded) {
      return res.status(409).json({ message: 'You have already responded to this request.' });
    }

    const commitment = await DonorCommitment.create({
      donor: req.user._id,
      donorName: req.user.name,
      donorPhone: req.user.phone || 'N/A',
      bloodGroup: details.bloodGroup || req.user.bloodGroup || 'A+',
      ...details,
    });

    if (details.referenceType === 'General') {
      await Notification.create({ recipient: details.hospital, type: 'donation_update', message: `${req.user.name} responded to your blood request.`, bloodRequest: details.referenceId, donation: commitment._id, dedupeKey: `response:${commitment._id}` });
    }

    res.status(201).json(commitment);
  } catch (error) {
    console.error('COMMITMENT ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update status
const updateCommitmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const commitment = await DonorCommitment.findById(req.params.id);

    if (!commitment) {
      return res.status(404).json({ message: 'Commitment record not found' });
    }

    const donorOwnsCommitment = req.user.role === 'user' && commitment.donor.toString() === req.user._id.toString();
    const hospitalOwnsCommitment = req.user.role === 'hospital' && req.user.approvalStatus === 'approved' && commitment.hospital.toString() === req.user._id.toString();
    const transitions = {
      Accepted: { donor: ['On the Way', 'Cancelled'], hospital: ['Cancelled'] },
      'On the Way': { donor: ['Cancelled'], hospital: ['Donated', 'Cancelled'] },
    };
    const actor = donorOwnsCommitment ? 'donor' : hospitalOwnsCommitment ? 'hospital' : null;
    if (!actor || !transitions[commitment.status]?.[actor]?.includes(status)) {
      return res.status(403).json({ message: 'You are not allowed to make this commitment status change.' });
    }

    commitment.status = status;
    if (status === 'On the Way') commitment.onTheWayAt = new Date();
    if (status === 'Donated') commitment.donatedAt = new Date();
    if (status === 'Cancelled') commitment.cancelledAt = new Date();
    await commitment.save();
    const notificationRecipient = donorOwnsCommitment ? commitment.hospital : commitment.donor;
    await Notification.create({ recipient: notificationRecipient, type: 'donation_update', message: `A donor response is now ${status}.`, bloodRequest: commitment.referenceType === 'General' ? commitment.referenceId : null, donation: commitment._id, dedupeKey: `status:${commitment._id}:${status}` });
    res.json(commitment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCommitments,
  createCommitment,
  updateCommitmentStatus
};
