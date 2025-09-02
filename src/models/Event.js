const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {type: String, required: true},
    date: {type: Date, required: true},
    endDate: {type: Date}, // Add end date for multi-day events
    address: {type: String, required: true},
    personCapacity: {type: Number, required: true},
    ticketPrice: {type: Number, required: true},
    ticketsSold: {type: Number, default: 0}, // Track sold tickets
    images: [{type: String}],
    location: {type: String, required: true},
    venue: {type: String}, // Add venue name
    numberOfTickets: {type: Number, required: true},
    organization: {type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true},
    website: {type: String},
    registrationLink: {type: String},
    registrationDeadline: {type: Date},
    attendees: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    checkedInAttendees: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], // Track attendance
    organizers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    teams: [{type: mongoose.Schema.Types.ObjectId, ref: 'Team'}],
    upcoming: {type: Boolean, default: true},
    cancelled: {type: Boolean, default: false},
    status: {type: String, enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'], default: 'draft'},
    type: {type: String, enum: ['conference', 'meetup', 'workshop', 'webinar', 'concert', 'festival', 'other'], default: 'other'},
    repeating: {type: Boolean, default: false},
    repeatInterval: {type: String, enum: ['daily', 'weekly', 'monthly', 'yearly']},
    description: {type: String},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    agenda: [{type: mongoose.Schema.Types.ObjectId, ref: 'Agenda'}], // Link to agenda items
    isPublic: {type: Boolean, default: true}, // Event visibility
    requiresApproval: {type: Boolean, default: false}, // Registration approval
    tags: [{type: String}], // Event tags for categorization
}, {timestamps: true});

module.exports = mongoose.model('Event', eventSchema);