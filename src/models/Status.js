const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String},
    color: {type: String, default: '#000000'},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    organization: {type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true},
}, {timestamps: true});

module.exports = mongoose.model('Status', statusSchema);