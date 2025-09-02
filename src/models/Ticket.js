const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    event: {type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true},
    ticketHolder: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    serialNumber: {type: String, unique: true, required: true},
    qrCode: {type: String, unique: true, required: true}, // For check-in
    price: {type: Number, required: true},
    discountAmount: {type: Number, default: 0},
    taxAmount: {type: Number, default: 0},
    totalAmount: {type: Number, required: true},
    type: {type: String, enum: ['general', 'vip', 'vvip', 'early_bird', 'student'], default: 'general'},
    status: {type: String, enum: ['active', 'used', 'expired', 'cancelled', 'refunded'], default: 'active'},
    purchaseDate: {type: Date, default: Date.now},
    purchaseMethod: {type: String, enum: ['online', 'offline'], default: 'online'},
    paymentStatus: {type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending'},
    paymentId: {type: String}, // Payment gateway transaction ID
    seatNumber: {type: String},
    section: {type: String},
    row: {type: String},
    gate: {type: String},
    validFrom: {type: Date},
    validTo: {type: Date},
    transferredTo: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // Ticket transfer
    transferredAt: {type: Date},
    refundStatus: {type: String, enum: ['none', 'requested', 'approved', 'processed'], default: 'none'},
    refundAmount: {type: Number, default: 0},
    refundDate: {type: Date},
    notes: {type: String},
    organization: {type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
}, {timestamps: true});

module.exports = mongoose.model('Ticket', ticketSchema);