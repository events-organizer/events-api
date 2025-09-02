const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {type: String, required: true,},
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    events: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
    description: {type: String},
    role: {type: String},
    status: {type: String, enum: ['active', 'inactive'], default: 'active'},
    permissions: [{type: String}],
    tags: [{type: String}],
    avatar: {type: String},
    coverImage: {type: String},
    location: {type: String},
    contactEmail: {type: String},
    contactPhone: {type: String},
    website: {type: String},
    socialLinks: {
        linkedin: {type: String},
        twitter: {type: String},
        facebook: {type: String},
        instagram: {type: String}
    },
    notes: {type: String},
    customFields: {type: Map, of: String},
    activityLogs: [{
        action: {type: String},
        performedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        timestamp: {type: Date, default: Date.now}
    }],
    lead: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    assistant: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    organization: {type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true},

}, {timestamps: true});

module.exports = mongoose.model('Team', teamSchema);