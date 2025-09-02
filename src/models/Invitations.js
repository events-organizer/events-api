const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
    event: {type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true},
    invitedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    invitedUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // Optional - for registered users
    invitedEmail: {type: String, required: true}, // For non-registered users
    invitedName: {type: String}, // Optional name for invitation
    type: {type: String, enum: ['event_invitation', 'team_invitation', 'speaker_invitation'], default: 'event_invitation'},
    role: {type: String, enum: ['organizer', 'attendee', 'speaker', 'volunteer'], default: 'attendee'},
    status: {type: String, enum: ['pending', 'accepted', 'declined', 'expired'], default: 'pending'},
    token: {type: String, required: true, unique: true},
    expiresAt: {type: Date, required: true},
    sentAt: {type: Date, default: Date.now},
    respondedAt: {type: Date},
    message: {type: String},
    ticketType: {type: String, enum: ['general', 'vip', 'vvip', 'free'], default: 'general'}, // Ticket type for invitation
}, {timestamps: true});

module.exports = mongoose.model('Invitation', invitationSchema);