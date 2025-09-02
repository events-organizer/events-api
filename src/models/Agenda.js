const mongoose = require('mongoose');

const agendaSchema = new mongoose.Schema({
    event: {type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true},
    title: {type: String, required: true},
    description: {type: String},
    startTime: {type: Date, required: true},
    endTime: {type: Date, required: true},
    speaker: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    location: {type: String},
    type: {type: String, enum: ['presentation', 'break', 'workshop', 'networking', 'other'], default: 'presentation'},
    order: {type: Number, required: true},
    isBreak: {type: Boolean, default: false},
    resources: [{
        title: {type: String},
        url: {type: String},
        type: {type: String, enum: ['document', 'video', 'image', 'link']}
    }],
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
}, {timestamps: true});

module.exports = mongoose.model('Agenda', agendaSchema);

