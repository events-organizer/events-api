const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    contactEmail: {type: String, required: true, unique: true},
    contactPhone: {type: String},
    website: {type: String},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    events: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
    teams: [{type: mongoose.Schema.Types.ObjectId, ref: 'Team'}],
    description: {type: String},
    type: {type: String, enum: ['non-profit', 'corporate', 'educational', 'other'], default: 'other'},
    upcomingEvents: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
    isVerified: {type: Boolean, default: false},
    invitations: [{
        email: {type: String, required: true},
        token: {type: String, required: true},
        invitedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        createdAt: {type: Date, default: Date.now, expires: '7d'} // Invitations expire after 7 days
    }],
    integrationDetails: {
        crm: {type: String},
        marketingPlatform: {type: String},
        analyticsTool: {type: String}
    },
    industry: {type: String},
    size: {type: String, enum: ['small', 'medium', 'large']},
    location: {type: String},
    pictures: [{type: String}],
    additionalInfo: [{type: String}],
    activityLogs: [{
        action: {type: String},
        performedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        timestamp: {type: Date, default: Date.now}
    }],
    approvalStatus: {type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending'},
    approvedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    approvedAt: {type: Date},
    additionalContacts: [{
        name: {type: String},
        email: {type: String},
        phone: {type: String},
        role: {type: String}
    }],
    additionalDocuments: [{
        title: {type: String},
        url: {type: String},
        uploadedAt: {type: Date, default: Date.now}
    }],
    socialLinks: {
        linkedin: {type: String},
        twitter: {type: String},
        facebook: {type: String},
        instagram: {type: String}
    },
    status: {type: String, enum: ['active', 'inactive', 'suspended', 'blocked'], default: 'active'},
}, {timestamps: true});

module.exports = mongoose.model('Organization', organizationSchema);