const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {type: String, required: true},
    date: {type: Date, required: true},
    address: {type: String, required: true},
    personCapacity: {type: Number, required: true},
    ticketPrice: {type: Number, required: true},
    images: [{type: String}],
    location: {type: String, required: true},
    numberOfTickets: {type: Number, required: true},
    organization: {type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true},
    website: {type: String},
    registrationLink: {type: String},
    registrationDeadline: {type: Date},
    attendees: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    organizers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    teams: [{type: mongoose.Schema.Types.ObjectId, ref: 'Team'}],
    upcoming: {type: Boolean, default: true},
    cancelled: {type: Boolean, default: false},
    status: {type: mongoose.Schema.Types.ObjectId, ref: 'Status', required: true},
    type: {type: String, enum: ['conference', 'meetup', 'workshop', 'webinar', 'concert', 'festival', 'other'], default: 'other'},
    repeating: {type: Boolean, default: false},
    repeatInterval: {type: String, enum: ['daily', 'weekly', 'monthly', 'yearly']},
    description: {type: String},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
}, {timestamps: true});

module.exports = mongoose.model('Event', eventSchema);