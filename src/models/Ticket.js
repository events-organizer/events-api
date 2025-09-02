const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: mongoose.Schema.Types.ObjectId, ref: 'Status', required: true},
    event: {type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true},
    priority: {type: String, enum: ['low', 'medium', 'high'], default: 'medium'},
    serialNumber: {type: String, unique: true, required: true},
    price: {type: Number, required: true},
    purchaseDate: {type: Date, default: Date.now},
    seatNumber: {type: String},
    type: {type: String, enum: ['general', 'vip', 'vvip', 'other'], default: 'general'},
    comments: [{
        text: {type: String, required: true},
        commentedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        createdAt: {type: Date, default: Date.now}
    }],
    attachments: [{type: String}],
    tags: [{type: String}],
    activityLogs: [{
        action: {type: String},
        performedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        timestamp: {type: Date, default: Date.now}
    }],
    ticketHolder: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    organization: {type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true},
    purchaseLink: {type: String},
    validFrom: {type: Date},
    validTo: {type: Date},
    purchaseMethod: {type: String, enum: ['online', 'offline', 'other'], default: 'online'},
    activityStatus: {type: String, enum: ['active', 'used', 'expired'], default: 'active'},
    notes: [{type: String}],
    discountCode: {type: String},
    discountAmount: {type: Number, default: 0},
    taxAmount: {type: Number, default: 0},
    totalAmount: {type: Number, required: true},
    feeDetails: {type: String},
    refundStatus: {type: String, enum: ['none', 'requested', 'processed'], default: 'none'},
    refundAmount: {type: Number, default: 0},
    refundDate: {type: Date},
    history: [{
        action: {type: String},
        performedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        timestamp: {type: Date, default: Date.now}
    }],
    location: {type: String},
    gate: {type: String},
    row: {type: String},
    section: {type: String},

    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, {timestamps: true});

module.exports = mongoose.model('Ticket', ticketSchema);