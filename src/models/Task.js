const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending'},
    dueDate: {type: Date},
    priority: {type: String, enum: ['low', 'medium', 'high'], default: 'medium'},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    assignedTo: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    relatedEvent: {type: mongoose.Schema.Types.ObjectId, ref: 'Event'},
    relatedTeam: {type: mongoose.Schema.Types.ObjectId, ref: 'Team'},
    comments: [{
        text: {type: String, required: true},
        commentedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        createdAt: {type: Date, default: Date.now}
    }],
    attachments: [{type: String}],
    tags: [{type: String}],
    subtasks: [{
        title: {type: String, required: true},
        status: { type: mongoose.Schema.Types.ObjectId, ref: 'Status', required: true, },
        dueDate: {type: Date},
        assignedTo: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    }],
    activityLogs: [{
        action: {type: String},
        performedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        timestamp: {type: Date, default: Date.now}
    }],
}, {timestamps: true});

module.exports = mongoose.model('Task', taskSchema);