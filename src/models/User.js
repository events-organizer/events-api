const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    name: {type: String}, // Virtual or computed field for full name
    email: {type: String, required: true, unique: true, lowercase: true},
    passwordHash: {type: String, select: false}, // For local auth
    phone: {type: String, unique: true, sparse: true},
    avatar: {type: String},
    profilePicture: {type: String}, // For Google auth compatibility
    bio: {type: String},
    role: {type: String, enum: ['admin', 'organizer', 'attendee'], default: 'attendee'},
    roles: [{type: String, enum: ['admin', 'organizer', 'attendee'], default: ['attendee']}], // For compatibility
    provider: {type: String, enum: ['local', 'google'], default: 'local'},
    providerId: {type: String}, // Google ID
    isEmailVerified: {type: Boolean, default: false},
    isPhoneVerified: {type: Boolean, default: false},
    emailVerified: {type: Boolean, default: false}, // For Google auth compatibility
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
    teams: [{type: mongoose.Schema.Types.ObjectId, ref: 'Team'}],
    attendedEvents: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
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
        expiresAt: {type: Date, required: true},
        createdAt: {type: Date, default: Date.now, expires: '7d'}, // Tokens expire after 7 days
        lastLoginAt: {type: Date},
        accountLocked: {type: Boolean, default: false},
        lockUntil: {type: Date}
    }]
}, {timestamps: true});

// Virtual for full name
userSchema.virtual('name').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {virtuals: true});
userSchema.set('toObject', {virtuals: true});

// Password hashing method
userSchema.methods.setPassword = async function (password) {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(password, salt);
};

// Password validation method
userSchema.methods.validatePassword = async function (password) {
    if (!this.passwordHash) return false;
    return await bcrypt.compare(password, this.passwordHash);
};

// Safe JSON method (exclude sensitive fields)
userSchema.methods.toSafeJSON = function () {
    const obj = this.toObject();
    delete obj.passwordHash;
    delete obj.refreshTokens;
    delete obj.__v;
    return obj;
};

// Index for performance
userSchema.index({email: 1});
userSchema.index({username: 1});
userSchema.index({phone: 1});
userSchema.index({providerId: 1, provider: 1});

module.exports = mongoose.model('User', userSchema);