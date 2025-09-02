const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: {type: String},
    avatar: {type: String},
    bio: {type: String},
    role: {type: String, enum: ['admin', 'organizer', 'attendee'], default: 'attendee'},
    isEmailVerified: {type: Boolean, default: false}, // Email verification
    isPhoneVerified: {type: Boolean, default: false}, // Phone verification
    preferences: {
        emailNotifications: {type: Boolean, default: true},
        smsNotifications: {type: Boolean, default: false},
        eventReminders: {type: Boolean, default: true}
    },
    events: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
    tickets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ticket'}],
    createdEvents: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
    createdTickets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ticket'}],
    assignedTickets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ticket'}],
    createdOrganizations: [{type: mongoose.Schema.Types.ObjectId, ref: 'Organization'}],
    enrolledOrganizations: [{type: mongoose.Schema.Types.ObjectId, ref: 'Organization'}],
    createdTeams: [{type: mongoose.Schema.Types.ObjectId, ref: 'Team'}],
    refreshTokens: [{
        token: {type: String, required: true},
        deviceInfo: {
            deviceId: {type: String},
            deviceType: {type: String},
            ipAddress: {type: String},
            deviceLocation: {type: String},
            lastUsedAt: {type: Date, default: Date.now},
            osVersion: {type: String},
            appVersion: {type: String}
        },
        createdAt: {type: Date, default: Date.now, expires: '7d'} // Tokens expire after 7 days
    }],
    teams: [{type: mongoose.Schema.Types.ObjectId, ref: 'Team'}],
    attendedEvents: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}], // Events attended
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);