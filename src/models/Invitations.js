const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
    event: {type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true},
    team: {type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true},
    invitedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    invitedUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    status: {type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending'},
    role: {type: String, enum: ['organizer', 'attendee', 'viewer'], default: 'attendee'},
    sentAt: {type: Date, default: Date.now},
    respondedAt: {type: Date},
    message: {type: String},
    token: {type: String, required: true, unique: true},
    expiresAt: {type: Date, required: true},
}, {timestamps: true});

module.exports = mongoose.model('Invitation', invitationSchema);