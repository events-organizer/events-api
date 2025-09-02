const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    event: {type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    ticket: {type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true},
    checkedIn: {type: Boolean, default: false},
    checkedInAt: {type: Date},
    checkedInBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    checkedOut: {type: Boolean, default: false},
    checkedOutAt: {type: Date},
    notes: {type: String},
    qrCode: {type: String, required: true, unique: true},
    deviceInfo: {
        deviceId: {type: String},
        ipAddress: {type: String},
        location: {type: String}
    }
}, {timestamps: true});

module.exports = mongoose.model('Attendance', attendanceSchema);

